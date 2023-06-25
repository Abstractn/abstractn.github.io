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