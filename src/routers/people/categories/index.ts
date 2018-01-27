
import createRouter from '@/utilities/functions/createRouter';
import * as PeopleCategoriesDb from '@/database/people/categories';

import { StatusCode } from '@/models/statusCodes';

const router = createRouter();

/**
 * @api {get} /categories Get All People Categories
 * @apiName GetPeopleCategories
 * @apiGroup People
 * @apiVersion  0.0.1
 * @apiDescription Returns all categories of people and their associated attributes
 *
 * @apiSuccess (200) {String} Success Successfully retrieved all people categories
 * @apiSuccessExample Success-Response:
 * 
  [
    { 
      name: "farmer",
      attributes: [
        "firstName",
        "paymentFrequency",
        "notes"
      ]
    },
    {
      name: "trader",
      attributes: [
        "firstName",
        "username"
      ]
    }
  ]
 */
router.get('/', async (req, res) => {
  const categories = await PeopleCategoriesDb.getAllPeopleCategories();
  res.status(StatusCode.OK).send(JSON.stringify(categories));
});

export default router;
