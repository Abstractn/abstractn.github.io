/**
 * @param {number} oldMin
 * @param {number} oldMax
 * @param {number} newMin
 * @param {number} newMax
 * @param {number} value
 * @returns {number}
*/
export function proportionalRange(
  oldMin, oldMax,
  newMin, newMax,
  value
) {
  return ((newMax - newMin) / (oldMax - oldMin)) * (value - oldMin) + newMin;
}

/**
 * @param {number} r
 * @param {number} g
 * @param {number} b
 * @returns {string} - format: hex `"RRGGBB"`
*/
export function rgbToHex(
  r,
  g,
  b
) {
  const isRedWithinRange   = r > -1 && r < 256;
  const isGreenWithinRange = g > -1 && g < 256;
  const isBlueWithinRange  = b > -1 && b < 256;
  if(isRedWithinRange && isGreenWithinRange && isBlueWithinRange) {
    return ((r << 16) | (g << 8) | b).toString(16).toUpperCase();
  } else {
    return null;
  }
}

/**
 * @param {number} [min]
 * @param {number} [max]
 * @returns {number}
*/
export function randomInt(
  min = 0,
  max = 1
) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * @param {string} query
 * @param {HTMLElement} [context]
 * @returns {HTMLElement | null}
*/
export function getNode(
  query,
  context
) {
  if(context) {
    return context.querySelector(query);
  } else {
    return document.querySelector(query);
  }
}

/**
 * @param {string} query
 * @param {HTMLElement} [context]
 * @returns {HTMLElement[] | null}
*/
export function getNodes(
  query,
  context = undefined
) {
  if(context) {
    const res = Array.from(context.querySelectorAll(query));
    return res.length ? res : null;
  } else {
    const res = Array.from(document.querySelectorAll(query));
    return res.length ? res : null;
  }
}