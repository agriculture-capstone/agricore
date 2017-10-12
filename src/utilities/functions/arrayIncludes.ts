// https://tc39.github.io/ecma262/#sec-array.prototype.includes
/**
 * Check if an array includes an element
 *
 * @param {array} [arr] The array to search
 * @param {any} [searchElement] The element to check for
 * @param {number} [fromIndex] The index to start from
 *
 * @returns {boolean} Whether or not the array includes an element
 */
export default function arrayIncludes<T>(arr: T[], searchElement: T, fromIndex?: number) {

  // 1. Let O be ? ToObject(arr value).
  if (arr == null) {
    throw new TypeError('"arr" is null or not defined');
  }

  const o = Object(arr);

  // 2. Let len be ? ToLength(? Get(O, "length")).
  const len = o.length >>> 0;

  // 3. If len is 0, return false.
  if (len === 0) {
    return false;
  }

  // 4. Let n be ? ToInteger(fromIndex).
  //    (If fromIndex is undefined, this step produces the value 0.)
  const n = fromIndex | 0;

  // 5. If n ≥ 0, then
  //  a. Let k be n.
  // 6. Else n < 0,
  //  a. Let k be len + n.
  //  b. If k < 0, let k be 0.
  let k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);

  function sameValueZero(x: any, y: any) {
    return x === y || (typeof x === 'number' && typeof y === 'number' && isNaN(x) && isNaN(y));
  }

  // 7. Repeat, while k < len
  while (k < len) {
    // a. Let elementK be the result of ? Get(O, ! ToString(k)).
    // b. If SameValueZero(searchElement, elementK) is true, return true.
    // c. Increase k by 1.
    if (sameValueZero(o[k], searchElement)) {
      return true;
    }
    k++;
  }

  // 8. Return false
  return false;
}
