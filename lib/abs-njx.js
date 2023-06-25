/**
 * Abstractn's iNJeCTS
 */

/**
 * @typedef {Object} Module
 * @property {string} name
 * @property {string} urlIcon
 * @property {Function} logic
 */

class Njx {
  /** @param {Array<Module>} module */
  constructor (module) {
    this.init();
  }

  static _DATA_STORAGE_KEY = 'abs.njx.data';

  init = () => {
    this.buildMenu();
  }

  buildNode = () => {
    const menuNode = document.createElement('div');
    
  }
}

new Njx([
  {
    name: 'Download',
    iconUrl: '',
    logic: () => {}
  }
]);