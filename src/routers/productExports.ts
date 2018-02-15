import createRouter from '@/utilities/functions/createRouter';
import * as ProdExportsService from '@/services/ProductExports';

import authorized from '@/middleware/authorized';
import { UserType } from '@/models/User/UserType';
import { StatusCode } from '@/models/statusCodes';

const router = createRouter();

/** Represents a product export in the API */
export interface ProdExport {
  uuid: string;
  transportId: string;
  datetime: string;
  productType: string;
  amountOfProduct: number;
}

/**
 * @api {get} /productexports Get all product exports
 * @apiName GetProductExports
 * @apiGroup ProductExports
 * @apiVersion  0.0.1
 * @apiDescription Returns all product exports of all types.
 *
 * @apiError (403) Forbidden Current user type does not have sufficient privileges.
 *
 * @apiSuccess (200) {String} Success Successfully retrieved all people from category <category>
 * @apiSuccessExample /productexports Success-Response:
  [
    {
      "uuid": "9f11efb5-d5b4-4853-aa88-ee10c2940c9f",
      "transportId": "A3C-X23"
      "datetime": "2018-01-23 04:05:06.000Z",
      "productType": "milk",
      "amountOfProduct": 10.23,
    },
    {
      "uuid": "3321269e-9b8b-432f-a668-b65c206235b0",
      "transportId": "A3C-X23",
      "datetime": "2018-01-23 04:05:20",
      "productType": "corn",
      "amountOfProduct": 5.2
    }
  ]
 */
router.get('/', async (req, res) => {
  const result = await ProdExportsService.getProdExportsFromDb();
  res.status(StatusCode.OK).send(result);
}, authorized(UserType.ADMIN, UserType.MONITOR, UserType.TRADER));

/**
 * @api {post} /productexports
 * @apiName CreateProductExport
 * @apiGroup ProductExports
 * @apiVersion 0.0.1
 * @apiDescription Creates a new product export entry.
 *              The new product export UUID is returned on success.
 *
 * @apiParam {String} uuid The UUID of the new product export.
 * @apiParam {String} transportId Identifier for mode of transport, max 255 characters.
 * @apiParam {String} datetime The time the export occured.
 * @apiParam {String} productType The type of product.
 * @apiParam {Number} amountOfProduct The amount of the product in it's given units.
 *                    The product's units can be checked via /product
 *
 * @apiError (400) BadRequest Missing or invalid fields, ...
 * @apiError (403) Forbidden Current user type does not have sufficient privileges.
 *
 * @apiSuccess (201) {String} Success Successfully created new product export entry
 * @apiSuccessExample Success-Response:
   {
     "uuid": "9f11efb5-d5b4-4853-aa88-ee10c2940c9f",
   }
 */
router.post('/', async (req, res) => {
  res.status(StatusCode.CREATED).send('Successfully created new product export');
}, authorized(UserType.ADMIN));

/**
 * @api {put} /productexports/:uuid
 * @apiName UpdateProductExport
 * @apiGroup ProductExports
 * @apiVersion 0.0.1
 * @apiDescription Updates a product export entry.
 *              Any fields not given will not be updated.
 *              Extra non existent fields will not be ignored.
 *
 * @apiParam {String} uuid Specify the UUID of the product export to update.
 * @apiParam [String] transportId Identifier for mode of transport, max 255 characters.
 * @apiParam [String] datetime The time the export occured.
 * @apiParam [String] productType The type of product.
 * @apiParam [Number] amountOfProduct The amount of the product in it's given units.
 *                    The product's units can be checked via /product
 *
 * @apiError (403) Forbidden Current user type does not have sufficient privileges.
 * @apiError (404) NotFound Product export not found
 *
 * @apiSuccess (200) {String} Successfully updated product export entry
 */
router.put('/:uuid', async (req, res) => {
  res.status(StatusCode.OK).send('Successfully updated product export');
}, authorized(UserType.ADMIN));

export default router;
