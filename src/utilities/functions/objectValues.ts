interface IterableObject<T> {
  [k: string]: T;
}

/**
 * Iterate over enumarable keys of object and build an array
 *
 * @param {object} [obj] The object to iterate over
 *
 * @returns {array} array of object values
 */
export default function objectValues<T>(obj: object) {
  return Object.keys(obj).map(k => (<IterableObject<T>>obj)[k]);
}
