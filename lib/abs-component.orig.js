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