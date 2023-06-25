class AbsAccordion {
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

  static init = () => {
    const NOT_SET_ERROR_STRING = 'param is not set or incorrectly set';
    let accordions = document.querySelectorAll(`.${this.containerSelector}`);
    accordions.forEach(accordion => {
      const header = accordion.querySelector(`.${this.headerSelector}`);
      const content = accordion.querySelector(`.${this.contentSelector}`);
      const icon = accordion.querySelector(`.${this.iconSelector}`)

      let eventTrigger;
      switch (this.eventTrigger) {
        case 'header':
          eventTrigger = header;
          break;

        case 'icon':
          eventTrigger = icon;
          break;

        default:
          eventTrigger = header;
          console.error(`[ABS] Event trigger error: ${NOT_SET_ERROR_STRING}`);
          break;
      }

      eventTrigger.addEventListener(this.eventType, () => {
        const icon = header.querySelector('.' + this.iconSelector);
        if (content.classList.contains(this.hidingClass)) {
          switch (this.iconType) {
            case 'class':
              icon.classList.replace(this.iconClosed, this.iconOpen);
              break;

            case 'text':
              icon.innerHTML = this.iconOpen;
              break;

            default:
              console.error(`[ABS] Icon error: ${NOT_SET_ERROR_STRING}`);
              break;
          }
        }
        else {
          switch (this.iconType) {
            case 'class':
              icon.classList.replace(this.iconOpen, this.iconClosed);
              break;

            case 'text':
              icon.innerHTML = this.iconClosed;
              break;

            default:
              console.error(`[ABS] Icon error: ${NOT_SET_ERROR_STRING}`);
              break;
          }
        }
        content.classList.toggle(this.hidingClass);
      });
    });
    return accordions;
  }
}