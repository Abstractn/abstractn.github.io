export type AbsComponentInitFunction = (nodeReference: HTMLElement) => HTMLElement;

export interface AbsComponent {
  init: AbsComponentInitFunction;
  ready?: Function;
  [key: string]: any;
};

export type AbsComponentList = [string[]] | [];

export class AbsComponentManager {
  static nodeAttributeSelector = 'data-abs-component';
  static _componentsClassMapper: Record<string, AbsComponent> = {};
  static components: AbsComponentList = [];

  static registerComponent(templateReferenceName: string, scriptClass: AbsComponent) {
    this._componentsClassMapper[templateReferenceName] = scriptClass;
  };

  static initComponent() {};
  
  static initComponents() {
    try {
      const componentNodeList: NodeListOf<HTMLElement> = document.querySelectorAll(`[${this.nodeAttributeSelector}]`);
      componentNodeList.forEach(componentNode => {
        const componentReferenceName = componentNode.getAttribute(this.nodeAttributeSelector) as string;
        if(this.components[componentReferenceName] === undefined) {
          this.components[componentReferenceName] = [];
        }
        //TODO
        const componentClass = new this._componentsClassMapper[componentReferenceName];
        this.components[componentReferenceName].push(componentClass.init(componentNode));
      });
    } catch (error) {
      console.error(error);
    }
  };
}





class MyCustomComponent implements AbsComponent {
  init = (test: HTMLElement) => {
    return test;
  }
}