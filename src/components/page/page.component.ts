import { AbsComponent } from 'abs-component';

export class Page implements AbsComponent {
  constructor(public readonly node: HTMLElement) {
  }

  init() {}

  ready() {}
}