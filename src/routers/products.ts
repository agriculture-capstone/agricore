import * as express from 'express';

import createRouter from '@/utilities/functions/createRouter';
import authorized from '@/middleware/authorized';
import { UserType } from '@/models/User/UserType';
import { StatusCode } from '@/models/statusCodes';

const router = createRouter();

/**
 * @api {get} /products
 * @description Returns all product types, their unique associated attributes, and their units.
 *              Parameters have no effect on this request.
 * @apiName GetPeople
 *
 * @apiError (401) Unauthorized - Must be admin
 *
 * @apiSuccess (200) {String} Successfully retrieved all product types
 * @apiSuccessExample Success-Response:
  milk: {
      "units": "litres",
      "attributes": [
        "density"
      ]
  }
 */
router.get('/', async (req, res) => {
  res.status(StatusCode.OK).send('Successfully retrieved all product exports') ;
}, authorized(UserType.ADMIN));

export default router;
