/**
 * @enum {"beforebegin" | "beforeend" | "afterbegin" | "afterend"}
*/
const AbsTemplatePrintMethod = Object.freeze({
  BEFORE_BEGIN: 'beforebegin',
  BEFORE_END: 'beforeend',
  AFTER_BEGIN: 'afterbegin',
  AFTER_END: 'afterend',
});

/* export interface AbsTemplateBuildConfig {
  templateNode: HTMLElement;
  templateData?: Record<string, string>;
  dataMatchExpression?: RegExp;
  printTargetNode: HTMLElement;
  printMethod: AbsTemplatePrintMethod;
}; */


/**
 * @callback AbsTemplateBuildFunction
 * @param {AbsTemplateBuildFunctionConfig} config
 * @returns {void}
*/

/**
 * @typedef {Object} AbsTemplateBuildFunctionConfig
 * @property {HTMLElement} templateNode
 * @property {Record<string, string>} [templateData]
 * @property {RegExp} [dataMatchExpression]
 * @property {HTMLElement} printTargetNode
 * @property {AbsTemplatePrintMethod} printMethod
*/

/**
 * @typedef {Class} AbsTemplate
 * @property {RegExp} DEFAULT_PARAMETER_MATCH_PATTERN - readonly
 * @property {Function} build
*/

class AbsTemplate {
  static _DEFAULT_PARAMETER_MATCH_PATTERN = /\{\{(.+?)\}\}/;
  
  /**
   * @type {AbsTemplateBuildFunction}
   */
  static build(config) {
    try {
      if(!Boolean(config.templateNode)) throw  `[ABS] "templateNode" is null or undefined`;
      const templateNodeContent = config.templateNode.innerHTML;
  
      const domParser = new DOMParser();
      const parsedDocument = domParser.parseFromString(templateNodeContent, 'text/html');
      const parsedDocumentBodyNode = parsedDocument.querySelector('body');
      let parsedDocumentBodyContent = parsedDocumentBodyNode.innerHTML;
  
      if( !(config.templateData === undefined || config.templateData === null) ) {
        const pattern = config.dataMatchExpression || this._DEFAULT_PARAMETER_MATCH_PATTERN;
        const parameterGlobalPattern = pattern.global ? pattern : new RegExp(pattern, 'g');
        const parameterPattern = pattern.global ? new RegExp(pattern, '') : pattern;
        const matches = parsedDocumentBodyContent.match(parameterGlobalPattern);
        matches?.forEach(match => {
          const dataMatches = parameterPattern.exec(match);
          const processedMatch = dataMatches[1];
          const matchedData = (config.templateData)[processedMatch];
          if(matchedData) {
            parsedDocumentBodyContent = parsedDocumentBodyContent.replace(match, matchedData);
          }
        });
      }
  
      const tempNode = document.createElement('div');
      tempNode.innerHTML = parsedDocumentBodyContent;
      const tempNodeContent = Array.from(tempNode.querySelectorAll('*'));
  
      if(config.printMethod === AbsTemplatePrintMethod.AFTER_BEGIN || config.printMethod === AbsTemplatePrintMethod.AFTER_END) {
        tempNodeContent.reverse();
      }
      tempNodeContent.forEach(node => {
        config.printTargetNode.insertAdjacentElement(config.printMethod, node);
      });
    } catch (error) {
      console.error(error);
    }
  }

  //TODO split the data compiling part of `build()` into its own function so that it can be used separately
  /* compile(targetNode: HTMLElement): HTMLElement {

  }; */
}