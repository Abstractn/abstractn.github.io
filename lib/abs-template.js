/**
 * @enum {"beforebegin" | "beforeend" | "afterbegin" | "afterend"}
*/
const AbsTemplatePrintMethod = Object.freeze({
  BEFORE_BEGIN: 'beforebegin',
  BEFORE_END: 'beforeend',
  AFTER_BEGIN: 'afterbegin',
  AFTER_END: 'afterend',
});

/** AbsTemplateData interface
 * @typedef {Record<string,string>|Object|any[]} AbsTemplateData
 */

/** AbsTemplateBuildConfig interface
 * @typedef {Object} AbsTemplateBuildConfig
 * @property {HTMLTemplateElement | HTMLElement} templateNode
 * @property {AbsTemplateData} [templateData]
 * @property {HTMLElement} printTargetNode
 * @property {AbsTemplatePrintMethod} printMethod
 */

class AbsTemplate {
  /**
   * @private
   * @constant {string}
   * @readonly
   */
  static CONSOLE_PREFIX = '[ABS][TEMPLATE]';
  /**
   * @public
   * @constant {RegExp}
   * @readonly
   */
  static PARAMETER_PATTERN = /\{\{(.+?)\}\}/;
  /**
   * @public
   * @constant {RegExp}
   * @readonly
   */
  static CONDITION_STATEMENT_PATTERN = /\{\{if (.+?)\}\}(.+?)(?:\{\{else\}\}(.+?))?\{\{\/if\}\}/;
  /**
   * @public
   * @constant {RegExp}
   * @readonly
   */
  static CONDITION_PATTERN = /(.+) (==|===|!=|!==|>|>=|<|<=|&&|\|\||%|\^) (.+)/;
  /**
   * @public
   * @constant {RegExp}
   * @readonly
   */
  static CYCLE_STATEMENT_PATTERN = /\{\{forEach (.+?) in (.+?)\}\}(.+?)\{\{\/forEach\}\}/;
  
  /**
   * @public
   * @param {AbsTemplateBuildConfig} config
   */
  static build(config) {
    try {
      if(!Boolean(config.templateNode)) throw  `${this.CONSOLE_PREFIX} "templateNode" in config is null or undefined`;
      let templateNodeContentString = this.getContentFromTemplateNode(config.templateNode);

      const isDataDefined = !(config.templateData === undefined || config.templateData === null);
      if(isDataDefined) {
        templateNodeContentString = templateNodeContentString.replaceAll('\n', '');
        templateNodeContentString = this.parse(templateNodeContentString, config.templateData);
      }

      const parsedNode = this.util.stringToNode(templateNodeContentString);
      this.print(Array.from(parsedNode.childNodes), config.printTargetNode, config.printMethod);
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * @private
   * @param {HTMLTemplateElement|HTMLElement} templateNode
   * @returns {string}
   */
  static getContentFromTemplateNode = (templateNode) => {
    const templateNodeContent = templateNode.innerHTML;
    const domParser = new DOMParser();
    const parsedDocument = domParser.parseFromString(templateNodeContent, 'text/html');
    const parsedDocumentBodyNode = parsedDocument.querySelector('body');
    return parsedDocumentBodyNode.innerHTML;
  }

  /**
   * @private
   * @param {HTMLElement[]} node
   * @param {HTMLElement} target
   * @param {AbsTemplatePrintMethod} method
   */
  static print(node, target, method) {
    if(method === AbsTemplatePrintMethod.AFTER_BEGIN || method === AbsTemplatePrintMethod.AFTER_END) {
      node.reverse();
    }
    node.forEach(nodeItem => {
      nodeItem.nodeType !== Node.TEXT_NODE && target.insertAdjacentElement(method, nodeItem);
    });
  }

  /**
   * @private
   * @param {string} template 
   * @param {RegExp} pattern 
   * @returns {RegExpMatchArray | null}
   */
  static getParseMatches = (template, pattern) => {
    const parameterGlobalPattern = new RegExp(pattern, 'g');
    const matches = template.match(parameterGlobalPattern);
    return matches;
  }

  /**
   * @private
   * @param {string} template 
   * @param {AbsTemplateData} data 
   * @param {RegExp} [patternOverride] 
   * @returns {string}
   */
  static parseParameters(template, data, patternOverride) {
    const parameterPattern = new RegExp(patternOverride || this.PARAMETER_PATTERN, '');
    const matches = this.getParseMatches(template, patternOverride || this.PARAMETER_PATTERN);
    matches?.forEach(match => {
      const dataMatches = parameterPattern.exec(match);
      const key = dataMatches[1];
      const keyValue = (data)[key];
      if(keyValue) {
        template = template.replace(match, keyValue);
      }
    });
    return template;
  }

  /**
   * @private
   * @param {string} template 
   * @param {AbsTemplateData} data 
   * @returns {string}
   */
  static parseConditions(template, data) {
    //BUG if there are multiple statements of the same type inside each other
    //the first level will probably match very first closing pattern found (the inner-most statement)
    //and the result is overlapped
    //FIXME run a `this.parse()` before anything else
    //by passing the `conditionContent` of the current match as restricted `template` parameter
    //as this will work recursively by finding the inner-most level
    //and leave only the correct closing pattern as last one
    const conditionStatementPattern = new RegExp(this.CONDITION_STATEMENT_PATTERN, '');
    const conditionPattern = new RegExp(this.CONDITION_PATTERN, '');
    const matches = this.getParseMatches(template, this.CONDITION_STATEMENT_PATTERN);
    matches?.forEach(match => {
      const matchGroups = conditionStatementPattern.exec(match);
      const statementBlock = matchGroups[0];
      const condition = matchGroups[1];
      const parsedCondition = conditionPattern.exec(condition);
      const isConditionSingleParameter = !Boolean(parsedCondition);
      const positiveContent = matchGroups[2];
      const negativeContent = matchGroups[3];
      /**
       * @param {boolean} conditionResult
       */
      const printConditionResult = (conditionResult) => {
        if(Boolean(conditionResult)) {
          template = template.replace(statementBlock, positiveContent);
        } else {
          template = template.replace(statementBlock, negativeContent || '');
        }
      };
      if(isConditionSingleParameter) {
        const parameter = data[condition];
        printConditionResult(Boolean(parameter));
      } else {
        /**
         * @param {string} parameter
         * @returns {boolean|null|undefined|string|number}
         */
        const sanitizeParameter = (parameter) => {
          return (
            !Number.isNaN(parseFloat(parameter)) ? parseFloat(parameter) :
            parameter === 'true' ? true :
            parameter === 'false' ? false :
            parameter === 'undefined' ? undefined :
            parameter === 'null' ? null :
            parameter
          );
        };
        const conditionMatchGroups = conditionPattern.exec(condition);
        const firstParameter = sanitizeParameter(conditionMatchGroups[1]);
        const operator = conditionMatchGroups[2];
        const secondParameter = sanitizeParameter(conditionMatchGroups[3]);
        let conditionResult = false;
        switch(operator) {
          case '==':  conditionResult = Boolean((firstParameter) ==  (secondParameter)); break;
          case '===': conditionResult = Boolean((firstParameter) === (secondParameter)); break;
          case '!=':  conditionResult = Boolean((firstParameter) !=  (secondParameter)); break;
          case '!==': conditionResult = Boolean((firstParameter) !== (secondParameter)); break;
          case '>':   conditionResult = Boolean((firstParameter) >   (secondParameter)); break;
          case '>=':  conditionResult = Boolean((firstParameter) >=  (secondParameter)); break;
          //case '<':   conditionResult = Boolean((firstParameter) <   (secondParameter)); break;
          //case '<=':  conditionResult = Boolean((firstParameter) <=  (secondParameter)); break;
          case '&&':  conditionResult = Boolean((firstParameter) &&  (secondParameter)); break;
          case '||':  conditionResult = Boolean((firstParameter) ||  (secondParameter)); break;
          case '%':   conditionResult = Boolean(parseFloat(firstParameter) % parseFloat(secondParameter)); break;
          case '^':   conditionResult = Boolean(parseFloat(firstParameter) ^ parseFloat(secondParameter)); break;
        }
        printConditionResult(conditionResult);
      }
    });
    return template;
  }

  /**
   * @private
   * @param {string} template
   * @param {AbsTemplateData} data
   * @returns {string}
   */
  static parseCycles(template, data) {
    //BUG if there are multiple statements of the same type inside each other
    //the first level will probably match very first closing pattern found (the inner-most statement)
    //and the result is overlapped
    //FIXME run a `this.parse()` before anything else
    //by passing the `cycleContent` of the current match as restricted `template` parameter
    //as this will work recursively by finding the inner-most level
    //and leave only the correct closing pattern as last one
    const cycleStatementPattern = new RegExp(this.CYCLE_STATEMENT_PATTERN, '');
    const matches = this.getParseMatches(template, this.CYCLE_STATEMENT_PATTERN);
    matches?.forEach(match => {
      const matchGroups = cycleStatementPattern.exec(match);
      const itemKey = matchGroups[1];
      const listKey = matchGroups[2];
      const cycleContent = matchGroups[3];

      const templateData = data;
      if(templateData) {
        const list = templateData[listKey];
        let res = '';
        if(!Array.isArray(list)) throw `${this.CONSOLE_PREFIX} Template contains a "forEach" with a parameter that cannot be iterated.`;
        list.forEach(listItem => {
          //BUG same case for statements inside each other
          //an `${itemKey}.(...listItem)` could be found not wrapped by standard curly brackets pattern
          const subParamRegex = new RegExp(`\\\{\\\{${itemKey}\\.(.+?)\\\}\\\}`,'g');
          res += this.parseParameters(cycleContent, listItem, subParamRegex);
        });
        template = template.replace(match, res);
      }
    });
    return template;
  }

  /**
   * @private
   * @param {string} template
   * @param {AbsTemplateData} data
   * @returns {string}
   */
  static parse(template, data) {
    template = this.parseConditions(template, data);
    template = this.parseCycles(template, data);
    template = this.parseParameters(template, data);
    return template;
  }

  /**
   * @public
   * @param {string} template
   * @param {AbsTemplateData} data
   * @returns {string}
   */
  static compile(template, data) {
    return this.parse(template, data);
  }

  /**
   * @private
   */
  static util = {
    /**
     * 
     * @param {HTMLElement} node 
     * @returns {string}
     */
    nodeToString: (node) => {
      return node.outerHTML.replaceAll('\n', '');
    },
    /**
     * 
     * @param {string} node 
     * @returns {HTMLElement}
     */
    stringToNode: (node) => {
      const resultNode = document.createElement('div');
      resultNode.innerHTML = node;
      //return [...(resultNode.querySelectorAll('*'))] as HTMLElement[];
      return resultNode;

    },
    /**
     * @param {string} string
     * @param {number} characterIndex
     * @returns {string}
     */
    removeCharacterFromString: (string, characterIndex) => {
      return string.substring(0, characterIndex) + string.substring(characterIndex + 1, string.length);
    }
  }
}