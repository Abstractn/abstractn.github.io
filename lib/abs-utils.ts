export function proportionalRange(
  oldMin: number, oldMax: number,
  newMin: number, newMax: number,
  value: number
): number {
  return ((newMax - newMin) / (oldMax - oldMin)) * (value - oldMin) + newMin;
}

export function rgbToHex(
  r: number,
  g: number,
  b: number
): string | null {
  const isRedWithinRange   = r > -1 && r < 256;
  const isGreenWithinRange = g > -1 && g < 256;
  const isBlueWithinRange  = b > -1 && b < 256;
  if(isRedWithinRange && isGreenWithinRange && isBlueWithinRange) {
    return ((r << 16) | (g << 8) | b).toString(16).toUpperCase();
  } else {
    return null;
  }
}

export function randomInt(
  min: number = 0,
  max: number = 1
): number {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getNode(
  query: string,
  context?: HTMLElement
): HTMLElement | null {
  if(context) {
    return context.querySelector(query);
  } else {
    return document.querySelector(query);
  }
}

declare global {
  interface Document {
    getNode(query: string): HTMLElement | null;
    getNodes(query: string): HTMLElement[] | null;
    setStyle(property: string, value: string): void;
    setStyles(propertyObject: Record<string, string>): void;
  }
  interface Element {
    getNode(query: string): HTMLElement | null;
    getNodes(query: string): HTMLElement[] | null;
    setStyle(property: string, value: string): void;
    setStyles(propertyObject: Record<string, string>): void;
  }
  interface HTMLElement {
    getNode(query: string): HTMLElement | null;
    getNodes(query: string): HTMLElement[] | null;
    setStyle(property: string, value: string): void;
    setStyles(propertyObject: Record<string, string>): void;
  }
  interface Node {
    getNode(query: string): HTMLElement | null;
    getNodes(query: string): HTMLElement[] | null;
    setStyle(property: string, value: string): void;
    setStyles(propertyObject: Record<string, string>): void;
  }
}

export function getNodes(
  query: string,
  context?: HTMLElement
): Array<HTMLElement> | null {
  if(context) {
    const res: Array<HTMLElement> = Array.from(context.querySelectorAll(query));
    return res.length ? res : null;
  } else {
    const res: Array<HTMLElement> = Array.from(document.querySelectorAll(query));
    return res.length ? res : null;
  }
}

[Document, Element, HTMLElement, Node].forEach(NativeClass => {
  NativeClass.prototype.getNode = function (query: string) { return getNode(query, this); }
  NativeClass.prototype.getNodes = function (query: string) { return getNodes(query, this); };
  NativeClass.prototype.setStyle = function(property: string, value: string) { this.style[property] = value; };
  NativeClass.prototype.setStyles = function (propertyObject: Record<string, string>) {
    Object.keys(propertyObject).forEach(property => {
      this.style[property] = propertyObject[property];
    });
  };
});