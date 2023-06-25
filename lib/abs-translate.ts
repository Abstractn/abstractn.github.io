export interface AbsTranslateDictionaryItem {
  translationKey: AbsTranslateDictionaryTranslationKey;
  label: string;
};

export interface AbsTranslateDictionary {
  languageId: AbsTranslateDictionaryId;
  content: AbsTranslateDictionaryItem[];
};

export type AbsTranslateDictionaryTranslationKey = string;
export type AbsTranslateDictionaryId = string;

export class AbsTranslate {
  public static storageKey: string = 'abs.translate';
  public static nodeAttributeSelector: string = 'data-abs-translate';
  public static isMissingTranslationWarningEnabled: boolean = false;
  private static _dictionary: AbsTranslateDictionary[] | undefined = undefined;
  private static _currentLanguage: AbsTranslateDictionaryId | null = null;
  private static _previousLanguage: AbsTranslateDictionaryId | null = null;

  public static setLanguage(languageId: AbsTranslateDictionaryId): void {
    try {
      if(this._dictionary === undefined) throw `[ABS] Dictionary is not defined.`;
      const selectedLanguage = this._dictionary.find(language => language.languageId === languageId)
      if(selectedLanguage === undefined) throw `[ABS] Language "${languageId}" not found.`;
      this._previousLanguage = this._currentLanguage;
      this._currentLanguage = languageId;
      this.storageKey && localStorage.setItem(this.storageKey, languageId);

      const nodeList: NodeListOf<HTMLElement> = document.querySelectorAll(`[${this.nodeAttributeSelector}]`);
      nodeList.forEach(node => {
        const translationKey: AbsTranslateDictionaryTranslationKey | null = node.getAttribute(this.nodeAttributeSelector);
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

  public static getCurrentLanguage(): AbsTranslateDictionaryId | null {
    return this._currentLanguage;
  }

  public static getPreviousLanguage(): AbsTranslateDictionaryId | null {
    return this._previousLanguage;
  }
  
  public static getCurrentLanguageDictionary(): AbsTranslateDictionary | null {
    const currentLanguage = this._dictionary?.find(language => language.languageId === this._currentLanguage);
    if(currentLanguage === undefined) {
      return null;
    } else {
      return this._utils.deepCopy(currentLanguage as Object) as AbsTranslateDictionary;
    }
  }

  public static getGlobalDictionary(): AbsTranslateDictionary[] {
    return this._utils.deepCopy(this._dictionary as Array<any>) as AbsTranslateDictionary[];
  }

  public static translate(translationKey: AbsTranslateDictionaryTranslationKey, language: AbsTranslateDictionaryId = this._currentLanguage as AbsTranslateDictionaryId): string | undefined {
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

  public static addDictionary(newDictionary: AbsTranslateDictionary): void {
    this._dictionary = this._dictionary || [];
    const oldDictionary = this._dictionary.find(dictionary => dictionary.languageId === newDictionary.languageId);
    const oldDictionaryIndex = this._dictionary.indexOf(oldDictionary as AbsTranslateDictionary);
    if(oldDictionaryIndex === -1) {
      this._dictionary.push(newDictionary);
    } else {
      this.isMissingTranslationWarningEnabled && console.warn(`[ABS] Language "${newDictionary.languageId} is duplicated and keys were merged with the previous version."`);
      this._dictionary[oldDictionaryIndex] = {...oldDictionary, ...newDictionary};
    }
  }

  public static removeDictionary(languageId: AbsTranslateDictionaryId): AbsTranslateDictionary | undefined {
    try {
      if(this._dictionary === undefined) throw `[ABS] Dictionary is not defined.`;
      const language = this._dictionary?.find(e => e.languageId === languageId);
      const languageIndex = this._dictionary?.indexOf(language as AbsTranslateDictionary);
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

  private static readonly _utils = {
    deepCopy: (src: any): any => {
      const target: any = Array.isArray(src) ? [] : {};
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