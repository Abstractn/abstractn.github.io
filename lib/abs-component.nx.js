/** AbsComponent interface
 * @typedef {Object} AbsComponent
 * @property {() => void} init
 * @property {() => void} [ready]
 * @property {HTMLElement} node
*/

/** AbsComponentList type
 * @typedef {Record<string, AbsComponent[]>} AbsComponentList
*/

/**
 * @class
*/
class AbsComponentManager {
  /**
   * @public
   * @static
  */
  static nodeAttributeSelector = 'data-abs-component';
  /**
   * @public
   * @static
   * @type {AbsComponentList}
  */
  static components = {};
  /**
   * @private
   * @static
   * @type {Record<string, new (node: HTMLElement) => AbsComponent>}
  */
  static componentsClassMapper = {};

  /**
   * @public
   * @static
   * @param {string} templateReferenceName
   * @param {new (node: HTMLElement) => AbsComponent} scriptClass
  */
  static registerComponent(templateReferenceName, scriptClass) {
    this.componentsClassMapper[templateReferenceName] = scriptClass;
  }

  /**
   * @public
   * @static
  */
  static initComponents() {
    try {
      document.querySelectorAll(`[${this.nodeAttributeSelector}]`).forEach((componentNode) => {
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

  /**
   * @public
   * @static
   * @param {HTMLElement} componentNode
  */
  static initComponent(componentNode) {
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