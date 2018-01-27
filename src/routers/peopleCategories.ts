
import createRouter from '@/utilities/functions/createRouter';
import * as PersonCategoriesDb from '@/database/PersonCategories';
import logger from '@/utilities/modules/logger';

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
  const categories = await PersonCategoriesDb.getAllPeopleCategories();
  res.status(StatusCode.OK).send(JSON.stringify(categories));
});

export default router;
