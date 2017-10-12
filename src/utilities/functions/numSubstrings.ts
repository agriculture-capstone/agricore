
/**
 * Count the number of occurances of `substr` in `str`
 *
 * @param {string} [str] String to check
 * @param {string} [substr] Substring to check for
 *
 * @returns {number} Number of occurances of `substr` in `str`
 */
export function numSubstrings(str: string, substr: string) {
  return str.split(substr).length - 1;
}
