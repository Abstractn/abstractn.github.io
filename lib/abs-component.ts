export interface AbsComponent {
  init: () => void;
  ready?: () => void;
  node: HTMLElement;
}

export type AbsComponentList = Record<string, AbsComponent[]>;

export class AbsComponentManager {
  public static nodeAttributeSelector: string = 'data-abs-component';
  public static components: AbsComponentList = {};
  private static componentsClassMapper: Record<string, new (node: HTMLElement) => AbsComponent> = {};

  public static registerComponent(templateReferenceName: string, scriptClass: new (node: HTMLElement) => AbsComponent): void {
    this.componentsClassMapper[templateReferenceName] = scriptClass;
  }

  public static initComponents(): void {
    try {
      document.querySelectorAll(`[${this.nodeAttributeSelector}]`).forEach((componentNode) => {
        const componentClassName = componentNode.getAttribute(this.nodeAttributeSelector);
        if(componentClassName === null) throw [`[ABS] The following node's component data attribute value is null:`, componentNode];
        if(this.componentsClassMapper[componentClassName] === undefined) throw `[ABS] Component initializer error: component "${componentClassName}" is not registered`;
        if(this.components[componentClassName] === undefined) {
          this.components[componentClassName] = [];
        }
        const ComponentClass = this.componentsClassMapper[componentClassName];
        const componentInstance = new ComponentClass(componentNode as HTMLElement);
        componentInstance.init();
        this.components[componentClassName].push(componentInstance);
      });
      Object.keys(this.components).forEach(componentName => {
        this.components[componentName].forEach(component => {
          if(component.ready) {
            component.ready();
          }
        })
      });
    } catch (error) {
      if(Array.isArray(error)) {
        console.error(...error);
      } else {
        console.error(error);
      }
    }
  }

  public static initComponent(componentNode: HTMLElement): void {
    try {
      const componentClassName = componentNode.getAttribute(this.nodeAttributeSelector);
      if(componentClassName === null) throw [`[ABS] The following node's component data attribute value is null:`, componentNode];
      if(this.componentsClassMapper[componentClassName] === undefined) throw `[ABS] Component initializer error: component "${componentClassName}" is not registered`;
      if(this.components[componentClassName] === undefined) {
        this.components[componentClassName] = [];
      }
      const ComponentClass = this.componentsClassMapper[componentClassName];
      const componentInstance = new ComponentClass(componentNode);
      componentInstance.init();
      this.components[componentClassName].push(componentInstance);
      if(componentInstance.ready) {
        componentInstance.ready();
      }
    } catch (error) {
      if(Array.isArray(error)) {
        console.error(...error);
      } else {
        console.error(error);
      }
    }
  }
}