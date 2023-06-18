// ################################################################################
// ### --- UTIL FUNCTIONS --- #####################################################
// ################################################################################

function log(elem)
{
    if(typeof _F_DEBUG == "undefined")
    { console.error("Please define 'const _F_DEBUG:boolean'"); }
    else if(_F_DEBUG)
    { console.log(elem); }
}

function proportionalRange(
  oldMin, oldMax,
  newMin, newMax,
  value
) {
  return ((newMax - newMin) / (oldMax - oldMin)) * (value - oldMin) + newMin;
}

function rgbToHex(r, g, b) {
  const isRedWithinRange   = r > -1 && r < 256;
  const isGreenWithinRange = g > -1 && g < 256;
  const isBlueWithinRange  = b > -1 && b < 256;
  if(isRedWithinRange && isGreenWithinRange && isBlueWithinRange) {
    return ((r << 16) | (g << 8) | b).toString(16).toUpperCase();
  } else {
    return undefined;
  }
}

function randomInt(min = 0, max = 1) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// ################################################################################
// ### --- ACCORDION --- ##########################################################
// ################################################################################

class AbsAccordion { 
    constructor() { throw Error('A static class cannot be instantiated.'); }
       
    static iconOpen = '-';
    static iconClosed = '+';
    static iconType = 'text'; // text || class
    static containerSelector = 'abs-accordion-container';
    static headerSelector = 'abs-accordion-header';
    static contentSelector = 'abs-accordion-content';
    static iconSelector = 'abs-accordion-icon';
    static hidingClass = 'hidden';
    static eventTrigger = 'header'; // header || icon
    static eventType = 'click'; // click || dbclick

    static init = function()
    {
        const NOT_SET_ERROR_STRING = 'param is not set or incorrectly set';
        let accordions = document.querySelectorAll('.' + this.containerSelector);
        accordions.forEach(accordion => {
            const header = accordion.querySelector('.' + this.headerSelector);
            const content = accordion.querySelector('.' + this.contentSelector);
            const icon = accordion.querySelector('.' + this.iconSelector)
            
            let eventTrigger;
            switch(this.eventTrigger) {
                case 'header':
                    eventTrigger = header;
                break;

                case 'icon': 
                    eventTrigger = icon;
                break;

                default: 
                    eventTrigger = header;
                    console.error('eventTrigger ' + NOT_SET_ERROR_STRING);
                break;
            }
            
            eventTrigger.addEventListener(this.eventType, () => {
                const icon = header.querySelector('.' + this.iconSelector);
                if( content.classList.contains(this.hidingClass) ) {
                    switch( this.iconType ) {
                        case 'class':
                            icon.classList.replace( this.iconClosed, this.iconOpen );
                        break;
                        
                        case 'text':
                            icon.innerHTML = this.iconOpen;
                        break;

                        default:
                            console.error('iconType ' + NOT_SET_ERROR_STRING);
                        break;
                    }
                }
                else {
                    switch( this.iconType ) {
                        case 'class':
                            icon.classList.replace( this.iconOpen, this.iconClosed );
                        break;

                        case 'text':
                            icon.innerHTML = this.iconClosed;
                        break;

                        default:
                            console.error('iconType ' + NOT_SET_ERROR_STRING);
                        break;
                    }
                }
                content.classList.toggle(this.hidingClass);
            });
        });
        return accordions;
    }
}

// ################################################################################
// ### --- TRANSLATE --- ##########################################################
// ################################################################################

class AbsTranslate {
    constructor() { throw Error('A static class cannot be instantiated.'); }

    static storageKey = 'language';
    static nodeSelector = 'data-translate';
    static missingTranslationWarning = false;
    static _dictionary = {};
    static _currentLanguage = null;
    static _previousLanguage = null;

    static setLanguage(languageID) {
        if(languageID) {
            if(this._dictionary[languageID]) {
                this._previousLanguage = this._currentLanguage;
                this._currentLanguage = languageID;
                if(this.storageKey) {
                    localStorage.setItem(this.storageKey,languageID);
                }
                let fields = document.querySelectorAll('[' + this.nodeSelector + ']');
                fields.forEach(field => {
                    const translationKey = field.getAttribute(this.nodeSelector);
                    if(this._dictionary[languageID][translationKey]) {
                        field.innerText = this._dictionary[languageID][translationKey];
                    } else {
                        if(this.missingTranslationWarning) {
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
        if(languageID && dictionary) {
            this._dictionary[languageID] = dictionary;
        }
    };

    static removeLanguage(languageID) {
        if(languageID && this._dictionary[languageID]) {
            if(languageID === this._currentLanguage) {
                console.error('Cannot delete currently used dictionary,');
            } else {
                delete this._dictionary[languageID];
            }
        }
    }
}
