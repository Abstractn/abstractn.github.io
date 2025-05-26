import { AbsComponent } from 'abs-component';

export class Header implements AbsComponent {
  constructor(public readonly node: HTMLElement) {
    
  }

  init() {}
  
  ready() {}
}