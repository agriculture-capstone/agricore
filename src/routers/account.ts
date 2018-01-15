import * as express from 'express';

import createRouter from '@/utilities/functions/createRouter';
import authorized from '@/middleware/authorized';
import { UserType } from '@/models/User/UserType';
import arrayIncludes from '@/utilities/functions/arrayIncludes';
import objectValues from '@/utilities/functions/objectValues';
import { hashPassword } from '@/services/authentication/password';
import * as UserDb from '@/database/User';
import logger from '@/utilities/modules/logger';
import { StatusCode } from '@/models/statusCodes';

const router = createRouter();

/* ******************  Routes ***********************/

/**
 * @api {put} /api/account/create Create new account
 * @apiName CreateAccount
 * @apiGroup Account
 * @apiVersion 0.0.1
 *
 *
 * @apiParam {String} username Username for account
 * @apiParam {String} password Password for account
 * @apiParam {String} userType Type of account
 *
 * @apiError (400) {String} BadRequest Invalid request body
 * @apiError (500) {String} ServerError Failed to create user
 *
 * @apiSuccess (200) {String} AccountCreated Successfully created user
 */
router.put('/create', async (req, res) => {
  if (!validateCreate(req.body)) {
    return void res.status(StatusCode.BAD_REQUEST).send('Invalid request body');
  }

  // Deconstruct object
  const { username, password, userType } = req.body;

  // Create the new user
  try {
    const hash = await hashPassword(password);
    await UserDb.createUser(username, hash, userType);
  } catch (err) {
    logger.error(`Failed to create user: ${username}`);
    return void res.status(StatusCode.INTERNAL_SERVER_ERROR).send('Failed to create user');
  }

  logger.info(`Created new user: ${username}`);

  res.status(StatusCode.OK).send('Successfully created user');
}, authorized(UserType.ADMIN));


/**
 * @api {delete} /api/account/delete/:username Delete specified account
 * @apiName Delete An Account
 * @apiGroup Account
 * @apiVersion  0.0.1
 *
 *
 * @apiParam  {String} username Username of account to delete
 *
 * @apiError (500) {String} Failed to delete user
 *
 * @apiSuccess (200) {String} Successfully deleted user
 */
router.delete('/delete/:username', async (req, res) => {
  if (!req.params || !req.params.username) {
    return void res.status(StatusCode.BAD_REQUEST).send('Missing username parameter');
  }
  const { username } = req.params;

  return deleteUser(username, res);
}, authorized(UserType.ADMIN));

/**
 * @api {delete} /account/delete Delete current account
 * @apiName Delete Current Account
 * @apiGroup Account
 * @apiVersion  0.0.1
 *
 *
 * @apiError (500) {String} Failed to delete user
 *
 * @apiSuccess (200) {String} Successfully deleted user
 */
router.delete('/delete', async (req, res) => {
  const { username } = req.user;
  return deleteUser(username, res);
});


/* ************* Helper Functions **********************/

async function deleteUser(username: string, res: express.Response): Promise<void> {
  try {
    await UserDb.deleteUser(username);
  } catch (err) {
    logger.error(`Failed to delete user ${username}`);
    return void res.status(StatusCode.INTERNAL_SERVER_ERROR).send('Failed to delete user');
  }

  return void res.status(StatusCode.OK).send('Successfully deleted user');
}

function validateCreate(body: any) {
  const { username, password, userType } = body;

  return !!(
    body &&
    username &&
    password &&
    userType &&
    arrayIncludes(objectValues<string>(UserType), userType) &&
    typeof(username) === 'string' &&
    typeof(password) === 'string'
  );
}

/** Account Router */
export default router;
