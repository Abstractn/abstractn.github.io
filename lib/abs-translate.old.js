class AbsTranslate {
  static storageKey = 'language';
  static nodeSelector = 'data-translate';
  static missingTranslationWarning = false;
  static _dictionary = {};
  static _currentLanguage = null;
  static _previousLanguage = null;

  static setLanguage(languageID) {
    if (languageID) {
      if (this._dictionary[languageID]) {
        this._previousLanguage = this._currentLanguage;
        this._currentLanguage = languageID;
        if (this.storageKey) {
          localStorage.setItem(this.storageKey, languageID);
        }
        let fields = document.querySelectorAll('[' + this.nodeSelector + ']');
        fields.forEach(field => {
          const translationKey = field.getAttribute(this.nodeSelector);
          if (this._dictionary[languageID][translationKey]) {
            field.innerText = this._dictionary[languageID][translationKey];
          } else {
            if (this.missingTranslationWarning) {
              console.warn('Translation key "' + translationKey + '" in dictionary "' + languageID + '" is missing');
            }
            field.innerText = field.getAttribute(this.nodeSelector);
          }
        });
      } else {
        console.error('Dictionary "' + languageID + '" is not defined.');
      }
    }
  };

  static addLanguage(languageID, dictionary) {
    if (languageID && dictionary) {
      this._dictionary[languageID] = dictionary;
    }
  };

  static removeLanguage(languageID) {
    if (languageID && this._dictionary[languageID]) {
      if (languageID === this._currentLanguage) {
        console.error('Cannot delete currently used dictionary,');
      } else {
        delete this._dictionary[languageID];
      }
    }
  }
}
