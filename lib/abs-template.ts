export enum AbsTemplatePrintMethod {
  BEFORE_BEGIN = 'beforebegin',
  BEFORE_END = 'beforeend',
  AFTER_BEGIN = 'afterbegin',
  AFTER_END = 'afterend',
};

export type AbsTemplateData = Record<string, string> | Object | any[];

export interface AbsTemplateBuildConfig {
  templateNode: HTMLTemplateElement | HTMLElement;
  templateData?: AbsTemplateData;
  printTargetNode: HTMLElement;
  printMethod: AbsTemplatePrintMethod;
};

export class AbsTemplate {
  private static readonly CONSOLE_PREFIX: string = '[ABS][TEMPLATE]';
  public static readonly PARAMETER_MATCH_PATTERN: RegExp = /\{\{(.+?)\}\}/;
  public static readonly CONDITION_MATCH_PATTERN: RegExp = /\{\{if (!?.+?)|((!?.+?) ==|===|!=|!==|>|>=|<|<=|&&|\|\| (!?.+?))\}\}/;
  public static readonly CYCLE_MATCH_PATTERN: RegExp = /\{\{forEach (.+?) in (.+?)\}\}(.+?)\{\{\/forEach\}\}/;
  
  public static build(config: AbsTemplateBuildConfig): void {
    try {
      if(!Boolean(config.templateNode)) throw  `${this.CONSOLE_PREFIX} "templateNode" in config is null or undefined`;
      let templateNodeContentString = this.getContentFromTemplateNode(config.templateNode);

      const isDataDefined = !(config.templateData === undefined || config.templateData === null);
      if(isDataDefined) {
        templateNodeContentString = templateNodeContentString.replaceAll('\n', '');
        templateNodeContentString = this.parse(templateNodeContentString, config.templateData as AbsTemplateData);
      }

      debugger;
      const parsedNode = this.util.stringToNode(templateNodeContentString);
      const mockNode = document.createElement('mock');
      mockNode.appendChild(parsedNode);
      const parsedNodeContent = Array.from(mockNode.querySelectorAll('div>*')) as HTMLElement[];
      
      this.print(parsedNodeContent, config.printTargetNode, config.printMethod);
    } catch (error) {
      console.error(error);
    }
  }

  private static getContentFromTemplateNode = (templateNode: HTMLTemplateElement | HTMLElement): string => {
    const templateNodeContent = templateNode.innerHTML;
    const domParser = new DOMParser();
    const parsedDocument = domParser.parseFromString(templateNodeContent as string, 'text/html');
    const parsedDocumentBodyNode = parsedDocument.querySelector('body') as HTMLElement;
    return parsedDocumentBodyNode.innerHTML;
  }

  private static print(node: HTMLElement | HTMLElement[], target: HTMLElement, method: AbsTemplatePrintMethod): void {
    if(Array.isArray(node)) {
      if(method === AbsTemplatePrintMethod.AFTER_BEGIN || method === AbsTemplatePrintMethod.AFTER_END) {
        node.reverse();
      }
      node.forEach(nodeItem => {
        target.insertAdjacentElement(method, nodeItem);
      });
    } else {
      target.insertAdjacentElement(method, node);
    }
  }

  private static getParseMatches = (template: string, pattern: RegExp): RegExpMatchArray | null => {
    const parameterGlobalPattern = new RegExp(pattern, 'g');
    const matches = template.match(parameterGlobalPattern);
    return matches;
  }

  private static parseParameters(template: string, data: AbsTemplateData, patternOverride?: RegExp): string {
    const parameterPattern = new RegExp(patternOverride || this.PARAMETER_MATCH_PATTERN, '');
    const matches = this.getParseMatches(template, patternOverride || this.PARAMETER_MATCH_PATTERN);
    matches?.forEach(match => {
      const dataMatches = parameterPattern.exec(match) as Array<string>;
      const key = dataMatches[1];
      const keyValue = (data as Record<string, string>)[key];
      if(keyValue) {
        template = template.replace(match, keyValue);
      }
    });
    return template;
  }

  private static parseConditions(template: string, data: AbsTemplateData): string {
    //BUG if there are multiple constructs of the same type inside each other
    //the first level will probably match very first closing pattern found (the inner-most construct)
    //and the result is overlapped
    //FIXME run a `this.parse()` before anything else
    //by passing the `conditionContent` of the current match as restricted `template` parameter
    //as this will work recursively by finding the inner-most level
    //and leave only the correct closing pattern as last one
    return template;
  }

  private static parseCycles(template: string, data: AbsTemplateData): string {
    //BUG if there are multiple constructs of the same type inside each other
    //the first level will probably match very first closing pattern found (the inner-most construct)
    //and the result is overlapped
    //FIXME run a `this.parse()` before anything else
    //by passing the `cycleContent` of the current match as restricted `template` parameter
    //as this will work recursively by finding the inner-most level
    //and leave only the correct closing pattern as last one
    const cyclePattern = new RegExp(this.CYCLE_MATCH_PATTERN, '');
    const matches = this.getParseMatches(template, this.CYCLE_MATCH_PATTERN);
    matches?.forEach(match => {
      const matchGroups = cyclePattern.exec(match) as Array<string>;
      const itemKey = matchGroups[1];
      const listKey = matchGroups[2];
      const cycleContent = matchGroups[3];

      const templateData = data as Record<string, string|Object|any[]>;
      if(templateData) {
        const list = templateData[listKey];
        let res = '';
        if(!Array.isArray(list)) throw `${this.CONSOLE_PREFIX} Template contains a "forEach" with a parameter that cannot be iterated.`;
        list.forEach(listItem => {
          //BUG same case for constructs inside each other
          //an `${itemKey}.(...listItem)` could be found not wrapped by standard curly brackets pattern
          const subParamRegex = new RegExp(`\\\{\\\{${itemKey}\\.(.+?)\\\}\\\}`,'g');
          res += this.parseParameters(cycleContent, listItem, subParamRegex);
        });
        template = template.replace(match, res);
      }
    });
    return template;
  }

  private static parse(template: string, data: AbsTemplateData): string {
    template = this.parseCycles(template, data);
    template = this.parseConditions(template, data);
    template = this.parseParameters(template, data);
    return template;
  }

  private static util = {
    nodeToString: (node: HTMLElement): string => {
      return node.outerHTML.replaceAll('\n', '');
    },
    stringToNode: (node: string): HTMLElement => {
      const resultNode = document.createElement('div');
      resultNode.innerHTML = node;
      //return [...(resultNode.querySelectorAll('*'))] as HTMLElement[];
      return resultNode;

    },
    removeCharacterFromString: (string: string, characterIndex: number): string => {
      return string.substring(0, characterIndex) + string.substring(characterIndex + 1, string.length);
    }
  }

  //TODO split the data compiling part of `build()` into its own function so that it can be used separately
  /* compile(targetNode: HTMLElement): HTMLElement {

  }; */
}