import { AbsComponent } from 'abs-component';
import { getNode } from 'abs-utilities';

export class InputArea implements AbsComponent {
  constructor(public readonly node: HTMLElement) {

  }

  init() {}
  
  ready() {}
}