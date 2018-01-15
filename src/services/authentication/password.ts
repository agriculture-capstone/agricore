import * as bcrypt from 'bcrypt';

/** Number of salt rounds to perform. **Must be at least 10** */
export const SALT_ROUNDS = 11;

/**
 * Hash a password
 *
 * @param {string} [password] Password to hash
 *
 * @returns {string} The password hash
 */
export async function hashPassword(password: string) {
  try {
    return await bcrypt.hash(password, SALT_ROUNDS);
  } catch (_) {
    throw new Error('bcrypt failed to hash password');
  }
}

/**
 * Check a password to see if it matches the provided hash
 *
 * @param {string} [password] Password to compare to hash
 * @param {string} [hash] Hash to compare to password
 *
 * @returns {boolean} Whether the password matches the hash
 */
export async function checkPassword(password: string, hash: string) {
  try {
    return await bcrypt.compare(password, hash);
  } catch (_) {
    throw new Error('bcrypt failed to check password');
  }
}
