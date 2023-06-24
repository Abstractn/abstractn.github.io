var componentManager = componentManager || {};
var components = components || {};
var componentsClassMapper = {};

componentManager.registerComponent = function (templateReferenceName, scriptClass) {
  componentsClassMapper[templateReferenceName] = scriptClass;
};

componentManager.initComponents = function () {
  try {
    document.querySelectorAll('[data-component]').forEach(componentNode => {
      const componentReferenceName = componentNode.getAttribute('data-component');
      if (components[componentReferenceName] === undefined) {
        components[componentReferenceName] = [];
      }
      if(componentsClassMapper[componentReferenceName] === undefined) {
        console.error(`[ABS] Component initializer error: component "${componentReferenceName}" is not registered`);
      }
      const componentClass = new componentsClassMapper[componentReferenceName];
      components[componentReferenceName].push(componentClass.init(componentNode));
    });
    Object.keys(components).forEach(componentArray => {
      components[componentArray].forEach(component => {
        if (component.ready) {
          component.ready();
        }
      });
    });
  } catch (error) {
    console.error(error);
  }
};

/**
 * @param {HTMLElement} componentNode
 */
componentManager.initComponent = function (componentNode) {
  try {
    const componentName = componentNode.getAttribute('data-component');
    if(componentsClassMapper[componentReferenceName] === undefined) {
      console.error(`[ABS] Component initializer error: component "${componentReferenceName}" is not registered`);
    }
    const newComponent = new componentsClassMapper[componentName];
    components[componentName].push(newComponent.init(componentNode));
    if(newComponent.ready) {
      newComponent.ready();
    }
  } catch (error) {
    console.error(error);
  }
};