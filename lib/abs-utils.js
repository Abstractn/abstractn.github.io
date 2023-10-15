/**
 * @param {number} oldMin
 * @param {number} oldMax
 * @param {number} newMin
 * @param {number} newMax
 * @param {number} value
 * @returns {number}
*/
export function proportionalRange(
  oldMin, oldMax,
  newMin, newMax,
  value
) {
  return ((newMax - newMin) / (oldMax - oldMin)) * (value - oldMin) + newMin;
}

/**
 * @param {number} r
 * @param {number} g
 * @param {number} b
 * @returns {string} - format: hex `"RRGGBB"`
*/
export function rgbToHex(
  r,
  g,
  b
) {
  const isRedWithinRange   = r > -1 && r < 256;
  const isGreenWithinRange = g > -1 && g < 256;
  const isBlueWithinRange  = b > -1 && b < 256;
  if(isRedWithinRange && isGreenWithinRange && isBlueWithinRange) {
    return ((r << 16) | (g << 8) | b).toString(16).toUpperCase();
  } else {
    return null;
  }
}

/**
 * @param {number} [min]
 * @param {number} [max]
 * @returns {number}
*/
export function randomInt(
  min = 0,
  max = 1
) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * @param {string} query
 * @param {HTMLElement} [context]
 * @returns {HTMLElement | null}
*/
export function getNode(
  query,
  context
) {
  if(context) {
    return context.querySelector(query);
  } else {
    return document.querySelector(query);
  }
}

/**
 * @param {string} query
 * @param {HTMLElement} [context]
 * @returns {HTMLElement[] | null}
*/
export function getNodes(
  query,
  context = undefined
) {
  if(context) {
    const res = Array.from(context.querySelectorAll(query));
    return res.length ? res : null;
  } else {
    const res = Array.from(document.querySelectorAll(query));
    return res.length ? res : null;
  }
}

export function absPolyfill() {
  [Document, Element, HTMLElement, Node].forEach(NativeClass => {
    //Object.defineProperty(
    //  NativeClass.prototype,
    //  'getNode',
    //  /**
    //   * @param {string} query
    //   * @returns {HTMLElement | null}
    //   */
    //  function (query) {
    //    return getNode(query, this);
    //  }
    //);
    //Object.defineProperty(
    //  NativeClass.prototype,
    //  'getNodes',
    //  /**
    //   * @param {string} query
    //   * @returns {HTMLElement[] | null}
    //   */
    //  function (query) {
    //    return getNodes(query, this);
    //  }
    //);
    //Object.defineProperty(
    //  NativeClass.prototype,
    //  'setStyle',
    //  /**
    //   * @param {string} property
    //   * @param {string} value
    //   */
    //  function (property, value) {
    //    this.style[property] = value;
    //  }
    //);
    //Object.defineProperty(
    //  NativeClass.prototype,
    //  'setStyles',
    //  /**
    //   * @param {Object} propertyObject
    //   */
    //  function (propertyObject) {
    //    Object.keys(propertyObject).forEach(property => {
    //      this.style[property] = propertyObject[property];
    //    });
    //  }
    //);
    NativeClass.prototype.getNode =  function (query) { return getNode(query, this); };
    NativeClass.prototype.getNodes = function (query) { return getNodes(query, this); };
    
    NativeClass.prototype.setStyle =  function (property, value) { this.style[property] = value; };
    NativeClass.prototype.setStyles = function (propertyObject) {
      Object.keys(propertyObject).forEach(property => {
        this.style[property] = propertyObject[property];
      });
    };
  });
}

export function absPolyfill() {
  [Document, Element, HTMLElement, Node].forEach(NativeClass => {
    Object.defineProperties(NativeClass.prototype, {
      getNode: {
        enumerable: false,
        configurable: true,
        writable: true,
        /**
         * @param {string} query
         * @returns {HTMLElement | null}
         */
        value: function (query) {
          return getNode(query, this);
        },
      },
      getNodes: {
        enumerable: false,
        configurable: true,
        writable: true,
        /**
          * @param {string} query
         * @returns {HTMLElement[] | null}
         */
        value: function (query) {
          return getNodes(query, this);
        },
      },
      setStyle: {
        enumerable: false,
        configurable: true,
        writable: true,
        /**
         * @param {string} property
         * @param {string} value
         */
        value: function (property, value) {
          this.style[property] = value;
        },
      },
      setStyles: {
        enumerable: false,
        configurable: true,
        writable: true,
        /**
         * @param {Object} propertyObject
         */
        value: function (propertyObject) {
          Object.keys(propertyObject).forEach(property => {
            this.style[property] = propertyObject[property];
          });
        },
      },
    });
  });
}