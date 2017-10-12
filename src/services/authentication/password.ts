import * as bcrypt from 'bcrypt';

import logger from '@/utilities/logger';

/** Number of salt rounds to perform. **Must be at least 10** */
export const SALT_ROUNDS = 11;

/**
 * Hash a password and return a promise resolving to the hash
 *
 * @param {string} [password] Password to hash
 *
 * @returns {Promise<string>} The password hash
 */
export async function hashPassword(password: string) {
  const hashPromise = bcrypt.hash(password, SALT_ROUNDS);
  hashPromise.catch(reason => logger.error(reason));

  return hashPromise;
}

/**
 * Check a password to see if it matches the provided hash
 *
 * @param {string} [password] Password to compare to hash
 * @param {string} [hash] Hash to compare to password
 *
 * @returns {Promise<boolean>} Whether the password matches the hash
 */
export async function checkPassword(password: string, hash: string) {
  const promise = bcrypt.compare(password, hash);
  promise.catch(reason => logger.error(reason));

  return promise;
}
