import * as express from 'express';

import createRouter from '@/utilities/functions/createRouter';
import authorized from '@/middleware/authorized';
import { UserType } from '@/models/User/UserType';
import arrayIncludes from '@/utilities/functions/arrayIncludes';
import { hashPassword } from '@/services/authentication/password';
import * as PersonDb from '@/database/Person';
import logger from '@/utilities/modules/logger';
import { StatusCode } from '@/models/statusCodes';

const router = createRouter();


/**
 * @api {get} /people/farmers
 * @description Parameters have no effect on this request
 * @apiName Get All Farmers
 * @apiGroup People
 * @apiVersion 0.0.1
 *
 * @apiError (401) Unauthorized - Must be admin or trader 
 * 
 * @apiSuccess (200) {String} Successfully retrieved all farmers 
 * @apiSuccessExample {type} Success-Response:
 * [{
      "personUuid": "",
      "firstName": "",
      "middleName": "",
      "lastName:" "", 
      "phoneNumber": "",
      "phoneArea:" "", 
      "phoneCountry": "",
      "companyName": "",
      "paymentFrequency": "",
      "notes": "",
    }]
 */
router.get('/farmers', async (req, res) => {
  // Create the new user
  try {
    await PersonDb.getFarmers();
  } catch (err) {
    logger.error(`Failed to retrieve all farmers.`);
    return void res.status(StatusCode.INTERNAL_SERVER_ERROR).send('Failed to create user');
  }

  res.status(StatusCode.OK).send('Successfully retrieved all farmers');
}, authorized(UserType.ADMIN, UserType.TRADER));