/** AbsTranslateDictionaryItem interface
 * @typedef {Object} AbsTranslateDictionaryItem
 * @property {AbsTranslateDictionaryTranslationKey} translationKey
 * @property {string} label
*/

/** AbsTranslateDictionary interface
 * @typedef {Object} AbsTranslateDictionary
 * @property {AbsTranslateDictionaryId} languageId
 * @property {AbsTranslateDictionaryItem[]} content
*/

/** AbsTranslateDictionaryTranslationKey type
 * @typedef {string} AbsTranslateDictionaryTranslationKey
*/

/** AbsTranslateDictionaryId type
 * @typedef {string} AbsTranslateDictionaryId
*/

/**
 * @class
 */
class AbsTranslate {
  /**
   * @public
   * @static
  */
  static storageKey = 'abs.translate';
  /**
   * @public
   * @static
  */
  static nodeAttributeSelector = 'data-abs-translate';
  /**
   * @public
   * @static
  */
  static isMissingTranslationWarningEnabled = false;
  /**
   * @private
   * @static
   * @type {AbsTranslateDictionary[] | undefined}
  */
  static _dictionary = undefined;
  /**
   * @private
   * @static
   * @type {AbsTranslateDictionaryId | null}
  */
  static _currentLanguage = null;
  /**
   * @private
   * @static
   * @type {AbsTranslateDictionaryId | null}
  */
  static _previousLanguage = null;

  /**
   * @public
   * @static
   * @param {AbsTranslateDictionaryId} languageId
  */
  static setLanguage(languageId) {
    try {
      if(this._dictionary === undefined) throw `[ABS] Dictionary is not defined.`;
      const selectedLanguage = this._dictionary.find(language => language.languageId === languageId)
      if(selectedLanguage === undefined) throw `[ABS] Language "${languageId}" not found.`;
      this._previousLanguage = this._currentLanguage;
      this._currentLanguage = languageId;
      this.storageKey && localStorage.setItem(this.storageKey, languageId);

      const nodeList = document.querySelectorAll(`[${this.nodeAttributeSelector}]`);
      nodeList.forEach(node => {
        const translationKey = node.getAttribute(this.nodeAttributeSelector);
        (translationKey === null && this.isMissingTranslationWarningEnabled) && console.warn(`[ABS] Translation key "${translationKey}" is not defined in language "${languageId}"`);
        if(translationKey) {
          const translation = this.translate(translationKey);
          node.innerText = translation || translationKey;
        }
      });
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * @public
   * @static
   * @returns {AbsTranslateDictionaryId | null}
  */
  static getCurrentLanguage() {
    return this._currentLanguage;
  }

  /**
   * @public
   * @static
   * @returns {AbsTranslateDictionaryId | null}
  */
  static getPreviousLanguage() {
    return this._previousLanguage;
  }
  
  /**
   * @public
   * @static
   * @returns {AbsTranslateDictionary | null}
  */
  static getCurrentLanguageDictionary() {
    const currentLanguage = this._dictionary?.find(language => language.languageId === this._currentLanguage);
    if(currentLanguage === undefined) {
      return null;
    } else {
      return this._utils.deepCopy(currentLanguage);
    }
  }

  /**
   * @public
   * @static
   * @returns {AbsTranslateDictionary[]}
  */
  static getGlobalDictionary() {
    return this._utils.deepCopy(this._dictionary);
  }

  /**
   * @public
   * @static
   * @param {AbsTranslateDictionaryTranslationKey} translationKey
   * @param {AbsTranslateDictionaryId} language
   * @returns {string | undefined}
  */
  static translate(translationKey, language = this._currentLanguage) {
    try {
      if(this._dictionary === undefined) throw `[ABS] Dictionary is not defined.`;
      const currentLanguageDictionary = this._dictionary?.find(dictionary => dictionary.languageId === language);
      if(language === undefined || language === null) throw `[ABS] Default language is not defined.`;
      if(currentLanguageDictionary === undefined) throw `[ABS] Language "${language}" not found.`;
      const translationItem = currentLanguageDictionary.content.find(languageItem => languageItem.translationKey === translationKey)
      return translationItem?.label || undefined;
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * @public
   * @static
   * @param {AbsTranslateDictionary} newDictionary
  */
  static addDictionary(newDictionary) {
    this._dictionary = this._dictionary || [];
    const oldDictionary = this._dictionary.find(dictionary => dictionary.languageId === newDictionary.languageId);
    const oldDictionaryIndex = this._dictionary.indexOf(oldDictionary);
    if(oldDictionaryIndex === -1) {
      this._dictionary.push(newDictionary);
    } else {
      this.isMissingTranslationWarningEnabled && console.warn(`[ABS] Language "${newDictionary.languageId} is duplicated and keys were merged with the previous version."`);
      this._dictionary[oldDictionaryIndex] = {...oldDictionary, ...newDictionary};
    }
  }

  /**
   * @public
   * @static
   * @param {AbsTranslateDictionaryId} languageId
   * @returns {AbsTranslateDictionary | undefined}
  */
  static removeDictionary(languageId) {
    try {
      if(this._dictionary === undefined) throw `[ABS] Dictionary is not defined.`;
      const language = this._dictionary?.find(e => e.languageId === languageId);
      const languageIndex = this._dictionary?.indexOf(language);
      const removedDictionary = languageIndex !== -1 ?
        this._dictionary.splice(languageIndex, 1)[0] :
        undefined;
      if(this._dictionary.length === 0) {
        this._dictionary = undefined;
      }
      return removedDictionary;
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * @private
   * @readonly 
  */
  static _utils = {
    deepCopy: (src) => {
      const target = Array.isArray(src) ? [] : {};
      for(let key in src) {
        const v = src[key];
        if(v) {
          if (typeof v === 'object') {
            target[key] = this._utils.deepCopy(v);
          } else {
            target[key] = v;
          }
        } else {
          target[key] = v;
        }
      }
      return target;
    }
  }
}