import { checkPassword } from '@/services/authentication/password';
import { findUser } from '@/database/Person';
import { createToken } from '@/services/authentication/token';
import logger from '@/utilities/modules/logger';
import { AuthError } from '@/errors/AuthError';

/**
 * Authenticate a user, and return a jwt if they are successful
 *
 * @param {string} [username] User to check
 * @param {string} [password] Password to validate
 * @param {object} [injectedFunctions=defaultFunctions] Injected dependencies, for testing purposes
 *
 * @return {string} JSON Web Token
 */
export async function authenticate(username: string, password: string) {
  const user = await findUser(username);
  const authenticated = await checkPassword(password, user.hash);
  if (authenticated) {
    const token = await createToken(user.username, user.userType);
    const uuid = user.uuid;
    return { token, uuid };
  } else {
    logger.error(`User '${user.username}' not authenticated`);
    throw new AuthError();
  }
}
