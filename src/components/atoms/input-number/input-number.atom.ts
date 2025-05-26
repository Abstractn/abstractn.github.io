import { AbsComponent } from 'abs-component';
import { getNode } from 'abs-utilities';

export class InputNumber implements AbsComponent {
  constructor(public readonly node: HTMLElement) {
    /* this.headerDesktopListNode = this.node.getNode('.header-list.-dsk') as HTMLElement;
    this.headerMobileListNode = this.node.getNode('.header-list.-mob') as HTMLElement;
    this.viewNodeList = document.getNodes('main view') as HTMLElement[]; */
    this.inputNode = this.node.getNode('input') as HTMLInputElement;
    this.increaseButtonNode = this.node.getNode('button[js-up]') as HTMLButtonElement|null;
    this.decreaseButtonNode = this.node.getNode('button[js-down]') as HTMLButtonElement|null;
    const parsedMin = parseInt(this.inputNode.getAttribute('min') as string);
    const parsedMax = parseInt(this.inputNode.getAttribute('max') as string);
    this.min = Number.isNaN(parsedMin) ? null : parsedMin;
    this.max = Number.isNaN(parsedMax) ? null : parsedMax;
  }

  /* private readonly VIEW_QUERYPARAM = 'view';
  private readonly VIEW_VISIBLE_CLASS = 'visible';
  private readonly BUTTON_ACTIVE_CLASS = 'active';
  private readonly headerListItemTemplateNode: HTMLButtonElement;
  private readonly viewNodeList: HTMLElement[];
  private headerDesktopButtonNodeList: HTMLButtonElement[] = [];
  private headerMobileButtonNodeList: HTMLButtonElement[] = []; */
  private readonly inputNode: HTMLInputElement;
  private readonly increaseButtonNode: HTMLButtonElement|null;
  private readonly decreaseButtonNode: HTMLButtonElement|null;
  private readonly min: number|null;
  private readonly max: number|null;

  initButtonStates() {
    const parsedValue = parseInt(this.inputNode.value);
    const isPastMax = Boolean(this.max && parsedValue >= this.max);
    const isPastMin = Boolean(this.min && parsedValue <= this.min);

    (this.increaseButtonNode && isPastMax) && this.increaseButtonNode.setAttribute('disabled', 'true');
    (this.decreaseButtonNode && isPastMin) && this.decreaseButtonNode.setAttribute('disabled', 'true');
  }

  setButtonEvents() {
    this.increaseButtonNode?.addEventListener('click', () => {
      //BUG if keyboard arrows are used then button is clicked, number passes limit
      const parsedValue = parseInt(this.inputNode.value);
      this.inputNode.value = (parsedValue + 1).toString();
      const newParsedValue = parseInt(this.inputNode.value);

      const isPastMax = Boolean(this.max !== null && newParsedValue >= this.max);
      isPastMax && this.increaseButtonNode?.setAttribute('disabled', 'true');
      this.decreaseButtonNode?.removeAttribute('disabled');
    });

    this.decreaseButtonNode?.addEventListener('click', () => {
      //BUG if keyboard arrows are used then button is clicked, number passes limit
      const parsedValue = parseInt(this.inputNode.value);
      this.inputNode.value = (parsedValue - 1).toString();
      const newParsedValue = parseInt(this.inputNode.value);
      
      const isPastMin = Boolean(this.min !== null && newParsedValue <= this.min);
      isPastMin && this.decreaseButtonNode?.setAttribute('disabled', 'true');
      this.increaseButtonNode?.removeAttribute('disabled');
    });
  }

  init() {
    this.initButtonStates();
    this.setButtonEvents();
  }
  
  ready() {}
}