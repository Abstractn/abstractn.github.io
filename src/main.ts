import './main.scss';

import { AbsComponentManager } from 'abs-component';
import { absPolyfill } from 'abs-utilities';

import { Header } from './components/header/header.component.ts';
import { Page } from './components/page/page.component.ts';

/* //import { absPolyfill } from 'abs-utilities';

import { InputText } from './components/atoms/input-text/input-text.atom.ts';
import { InputNumber } from './components/atoms/input-number/input-number.atom.ts';
import { InputArea } from './components/atoms/input-area/input-area.atom.ts';
import { InputDate } from './components/atoms/input-date/input-date.atom.ts';

import { AniCalc } from './components/ani-calc/ani-calc.component.ts';
import { Binco } from './components/binco/binco.component.ts';
import { ProportionalRange } from './components/proportional-range/proportional-range.component.ts';
import { RandomInt } from './components/random-int/random-int.component.ts'; */

absPolyfill();

export const absComponentManager = new AbsComponentManager({
  nodeAttributeSelector: 'cmp',
});

[
  Header,
  Page,
].forEach(Component => {
  absComponentManager.registerComponent(
    Component.prototype.constructor.name,
    Component
  );
});

absComponentManager.initComponents();