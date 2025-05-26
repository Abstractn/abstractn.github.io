import { AbsComponent } from 'abs-component';
import { getNode } from 'abs-utilities';

export class InputText implements AbsComponent {
  constructor(public readonly node: HTMLElement) {

  }

  init() {}
  
  ready() {}
}