import createRouter from '@/utilities/functions/createRouter';
import { StatusCode } from '@/models/statusCodes';
import * as ProductTypesDb from '@/database/products';

import authorized from '@/middleware/authorized';

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
[
  {
    "name": milk,
    "units": "liters",
    "attributes": [
      "density",
      "viscosity"
    ]
  },{
    "name": corn,
    "units": kilograms,
    "attributes": [
      "colour",
    ]
  }
]
*/
router.get('/', async (req, res) => {
  const response = await ProductTypesDb.getProductTypes();
  res.status(StatusCode.OK).send(JSON.stringify(response));
}, authorized());

export default router;
