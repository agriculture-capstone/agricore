
import createRouter from '@/utilities/functions/createRouter';
import authorized from '@/middleware/authorized';
import { UserType } from '@/models/User/UserType';
import { StatusCode } from '@/models/statusCodes';

const router = createRouter();

/**
 * @api {get} /productexports Get all product exports
 * @apiName GetProductExports
 * @apiGroup ProductExports
 * @apiVersion  0.0.1
 * @apiDescription Returns all product exports of all types with all their attributes.
 *
 * @apiError (403) Forbidden Current user type does not have sufficient privileges.
 *
 * @apiSuccess (200) {String} Success Successfully retrieved all people from category <category>
 * @apiSuccessExample /people/farmers Success-Response:
  [
    {
      "productTransactionUuid": "9f11efb5-d5b4-4853-aa88-ee10c2940c9f",
      "datetime": "2018-01-23 04:05:06",
      "toPersonUuid": "34e0574e-beea-498d-8bec-7f26d84ba761",
      "fromPersonUuid": "95bb2019-d135-49a8-83a7-4bf8f54684a0",
      "productType": "milk",
      "amountOfProduct": 10.23,
      "productUnits": "litres",
      "costPerUnit": 22.56,
      "currency": "UGX",
      "density": "5"
    },
    {
      "productTransactionUuid": "3321269e-9b8b-432f-a668-b65c206235b0",
      "datetime": "2018-01-23 04:05:20",
      "toPersonUuid": "34e0574e-beea-498d-8bec-7f26d84ba761",
      "fromPersonUuid": "95bb2019-d135-49a8-83a7-4bf8f54684a0",
      "productType": "corn",
      "amountOfProduct": 5.2,
      "productUnits": "kilograms",
      "costPerUnit": 2.2,
      "currency": "USD"
    }
  ]
 */
router.get('/', async (req, res) => {
  res.status(StatusCode.OK).send('Successfully retrieved all product exports') ;
}, authorized(UserType.ADMIN));

/**
 * @api {post} /productexports
 * @apiName CreateProductExport
 * @apiGroup ProductExports
 * @apiVersion 0.0.1
 * @apiDescription Creates a new product export entry.
 *              Required fields are:
 *                - datetime (UTC)
 *                - productType
 *                - toPersonUuid
 *                - fromPersonUuid
 *                - productType
 *                - amountOfProduct
 *                - costPerUnit
 *                - currency
 *              Along with any associated attributes.
 *              Associated attributes can be checked via /products.
 *              The new product export UUID is returned.
 *
 * @apiError (400) BadRequest Missing or invalid fields, ...
 * @apiError (403) Forbidden Current user type does not have sufficient privileges.
 *
 * @apiSuccess (201) {String} Success Successfully created new product export entry
 * @apiSuccessExample Success-Response:
   {
     "productTransactionUuid": "9f11efb5-d5b4-4853-aa88-ee10c2940c9f",
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
 *              Possible fields are:
 *                - productTransactionUuid
 *                - productType
 *                - datetime (UTC)
 *                - toPersonUuid
 *                - fromPersonUuid
 *                - amountOfProduct
 *                - costPerUnit
 *                - currency
 *              Along with any associated attributes.
 *              Associated attributes can be checked via /products.
 *              Any fields not given will not be updated.
 *              Extra non existent fields will not be ignored.
 *
 * @apiParam {String} uuid Specify the UUID of the product export to update.
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
