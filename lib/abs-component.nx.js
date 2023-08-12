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

  /**
   * @public
   * @static
   * @param {HTMLElement} componentNode
   * @returns {AbsComponent | undefined}
  */
  static getComponentByNode(componentNode) {
    let res = undefined;
    Object.keys(this.components).forEach(componentName => {
      const componentSearchResult = this.components[componentName].find(componentInstance => componentInstance.node === componentNode);
      if(componentSearchResult) {
        res = componentSearchResult;
      }
    });
    return res;
  }

  /**
   * @public
   * @static
   * @param {AbsComponent} component
  */
  static destroyComponent(component) {
    Object.keys(this.components).forEach(componentName => {
      const componentSearchResult = this.components[componentName].find(componentInstance => componentInstance === component);
      if(componentSearchResult) {
        const subComponentsNodeList = component.node.querySelectorAll(`[${this.nodeAttributeSelector}]`);
        subComponentsNodeList.forEach(subComponentNode => {
          const subComponentReference = this.getComponentByNode(subComponentNode);
          if(subComponentReference) this.destroyComponent(subComponentReference);
        });
        if(component.destroy) component.destroy();
        
        component.node.remove();
        
        const componentIndex = this.components[componentName].indexOf(component);
        this.components[componentName].splice(componentIndex, 1);
      }
    });
  }

  /**
   * @public
   * @static
   */
  static purgeComponentsList() {
    Object.keys(this.components).forEach(componentName => {
      this.components[componentName].forEach(component => {
        const componentAttributeName = component.node.getAttribute(this.nodeAttributeSelector);
        const isComponentAlive = Boolean(
          document.querySelector(`[${this.nodeAttributeSelector}="${componentAttributeName}"]`)
        );
        
        if(!isComponentAlive) this.destroyComponent(component);
      });
    });
  }
}