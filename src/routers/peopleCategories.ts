import * as express from 'express';

import createRouter from '@/utilities/functions/createRouter';
import authorized from '@/middleware/authorized';
import { UserType } from '@/models/User/UserType';

import { StatusCode } from '@/models/statusCodes';

const router = createRouter();

/**
 * @api {get} /peopleCategories Get All People Categories
 * @apiName GetPeopleCategories
 * @apiGroup People
 * @apiVersion  0.0.1
 * @apiDescription Returns all categories of people and their associated attributes
 *
 * @apiSuccess (200) {String} Success Successfully retrieved all people categories
 * @apiSuccessExample Success-Response:
  {
    farmer: [
      "firstName",
      "paymentFrequency"
      "notes"
    ],
    trader: [
      "firstName",
      "username"
    ]
  }
 */
router.get('/', async (req, res) => {
  res.status(StatusCode.OK).send('Successfully retrieved all people categories');
}, authorized(UserType.ADMIN));

export default router;
