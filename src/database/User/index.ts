import dbConnection, { tableNames, execute } from '../connection';
import { DatabaseUser } from '@/models/User';
import { UserType } from '@/models/User/UserType';

const userTable = () => dbConnection()(tableNames.USERS);

const builders = {
  /** QueryBuilder for selecting user */
  selectFromUser(attributes: string, username: string) {
    return userTable().select(attributes).where({
      username,
    });
  },

  /** QueryBuilder for deleting user */
  deleteUser(username: string) {
    return userTable().where({
      username,
    }).delete();
  },

  /** QueryBuilder for finding a single user */
  findUser(username: string) {
    return builders.selectFromUser('*', username);
  },

  /** QueryBuilder for selecting user hash */
  findUserHash(username: string) {
    return builders.selectFromUser('hash', username);
  },

  /** QueryBuilder for creating user */
  createUser(username: string, hash: string, userType: UserType) {
    if (!~hash.indexOf('$')) {
      throw new Error('Trying to store password in database');
    }

    return userTable().insert({
      username,
      hash,
      userType,
    });
  },
};

/* ***************** Helpers **********************/

function validateSingleUser(username: string, results: any[]) {
  if (results.length !== 1) {
    throw new Error(`Duplicate usernames in the database: ${username}`);
  }
}

/* ***************** Exports **********************/

/**
 * Find the user for the given username
 *
 * @param {string} [username] The username of the target user
 *
 * @returns {Promise<DatabaseUser>}
 *
 * @throws {Error} the user does not exist
 */
export async function findUser(username: string) {
  const results = await execute<DatabaseUser[]>(builders.findUser(username));
  validateSingleUser(username, results);
  return results.shift();
}

/**
 * Find the user hash for the given username
 *
 * @param {string} [username] The username of the target user
 *
 * @returns {Promise<string>} The hash of the user
 *
 * @throws {Error} the user does not exist
 */
export async function findUserHash(username: string) {
  const results = await execute<string[]>(builders.findUserHash(username));
  validateSingleUser(username, results);
  return results.shift();
}

/**
 * Create a user with the given properties
 *
 * @param {string} [username] The username of the user
 * @param {string} [hash] The password hash for the user
 * @param {UserType} [userType] The type of the user
 *
 * @returns {Promise<void>} A void promise
 *
 * @throws {Error} The username already exists
 *
 * @async
 */
export async function createUser(username: string, hash: string, userType: UserType) {
  return execute<void>(builders.createUser(username, hash, userType));
}

/**
 * Remove a user from the database
 *
 * @param {string} [username] The username of the user to delete
 *
 * @returns {Promise<void>} A void promise
 *
 * @throws {Error} The user does not exist
 *
 * @async
 */
export async function deleteUser(username: string) {
  return execute<void>(builders.deleteUser(username));
}
