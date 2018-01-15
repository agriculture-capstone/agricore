import { checkPassword } from '@/services/authentication/password';
import { findUser } from '@/database/User';
import { createToken } from '@/services/authentication/token';
import logger from '@/utilities/modules/logger';

/**
 * Authenticate a user, and return a jwt if they are successful
 *
 * @param {string} [username] User to check
 * @param {string} [password] Password to validate
 * @param {object} [injectedFunctions=defaultFunctions] Injected dependencies, for testing purposes
 * @return {Promise<string>} JSON Web Token
 */
export async function authenticate(username: string, password: string) {
  const userPromise = findUser(username).then(async (user) => {
    return checkPassword(password, user.hash)
      .then(async (authenticated) => {
        if (authenticated) {
          return createToken(user.username, user.userType);
        }

        logger.error('User not authenticated');
      });
  });

  return Promise.resolve<string>(userPromise);
}
