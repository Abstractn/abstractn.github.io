export enum AbsTemplatePrintMethod {
  BEFORE_BEGIN = 'beforebegin',
  BEFORE_END = 'beforeend',
  AFTER_BEGIN = 'afterbegin',
  AFTER_END = 'afterend',
};

export interface AbsTemplateBuildConfig {
  templateNode: HTMLElement;
  templateData?: Record<string, string>;
  dataMatchExpression?: RegExp;
  printTargetNode: HTMLElement;
  printMethod: AbsTemplatePrintMethod;
};

export default class AbsTemplate {
  public static readonly _DEFAULT_PARAMETER_MATCH_PATTERN: RegExp = /\{\{(.+?)\}\}/;
  
  public static build(config: AbsTemplateBuildConfig): void {
    if(!Boolean(config.templateNode)) throw  Error(`[ABS] "templateNode" is null or undefined`);
    const templateNodeContent = config.templateNode.innerHTML;

    const domParser = new DOMParser();
    const parsedDocument = domParser.parseFromString(templateNodeContent as string, 'text/html');
    const parsedDocumentBodyNode = parsedDocument.querySelector('body') as HTMLElement;
    let parsedDocumentBodyContent = parsedDocumentBodyNode.innerHTML;

    if( !(config.templateData === undefined || config.templateData === null) ) {
      const pattern = config.dataMatchExpression || this._DEFAULT_PARAMETER_MATCH_PATTERN;
      const parameterGlobalPattern = pattern.global ? pattern : new RegExp(pattern, 'g');
      const parameterPattern = pattern.global ? new RegExp(pattern, '') : pattern;
      const matches = parsedDocumentBodyContent.match(parameterGlobalPattern);
      matches?.forEach(match => {
        const dataMatches = parameterPattern.exec(match) as Array<string>;
        const processedMatch = dataMatches[1];
        const matchedData = (config.templateData as Record<string, string>)[processedMatch];
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
  }

  //TODO split the data compiling part of `build()` into its own function so that it can be used separately
  /* compile(targetNode: HTMLElement): HTMLElement {

  }; */
}