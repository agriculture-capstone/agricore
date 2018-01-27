import * as express from 'express';

import createRouter from '@/utilities/functions/createRouter';
import authorized from '@/middleware/authorized';
import { UserType } from '@/models/User/UserType';

import { StatusCode } from '@/models/statusCodes';

const router = createRouter();

/**
 * @api {get} /products Get All Product Types
 * @apiName GetProductTypes
 * @apiGroup ProductTypes
 * @apiVersion  0.0.1
 * @apiDescription Returns all types of products and their associated attributes
 *
 * @apiSuccess (200) {String} Success Successfully retrieved all product types
 * @apiSuccessExample Success-Response:
  {
    milk: [
      "density",
      "viscosity"
    ],
    corn: [
      "colour",
    ]
  }
 */
router.get('/', async (req, res) => {
  res.status(StatusCode.OK).send('Successfully retrieved all product types');
}, authorized(UserType.ADMIN));

export default router;
