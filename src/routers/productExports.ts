
import createRouter from '@/utilities/functions/createRouter';
import authorized from '@/middleware/authorized';
import { UserType } from '@/models/User/UserType';
import { StatusCode } from '@/models/statusCodes';

const router = createRouter();

/**
 * @api {get} /productexports
 * @description Returns all product exports and all their associated attributes.
 *              Guaranteed fields are:
 *                - productTransactionUuid
 *                - productType
 *                - datetime (UTC)
 *                - toPersonUuid
 *                - fromPersonUuid
 *                - amountOfProduct
 *                - productUnits
 *                - costPerUnit
 *                - currency
 *              Parameters have no effect on this request.
 *              Associated attributes can be checked via /products/
 * @apiName GetProductExports
 *
 * @apiError (401) Unauthorized - Must be admin
 *
 * @apiSuccess (200) {String} Successfully retrieved all product exports
 * @apiSuccessExample Success-Response:
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
  // TODO
  res.status(StatusCode.OK).send('Successfully retrieved all product exports') ;
}, authorized(UserType.ADMIN));

/**
 * @api {get} /productexports
 * @description Creates a new product export entry.
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
 *              The product UUID is returned.
 * @apiName CreateProductExport
 *
 * @apiError (400) The following fields are missing, ...
 * @apiError (400) The product type does not exist
 * @apiError (401) Unauthorized - Must be admin
 *
 * @apiSuccess (200) {String} Successfully created new product export entry
 * @apiSuccessExample Success-Response:
   {
     "productTransactionUuid": "9f11efb5-d5b4-4853-aa88-ee10c2940c9f",
   }
 */
router.post('/', async (req, res) => {
  // TODO
  res.status(StatusCode.CREATED).send('Successfully created new product export');
}, authorized(UserType.ADMIN));

/**
 * @api {put} /productexports
 * @description Updates a product export entry.
 *              Required fields are:
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
 * @apiName UpdateProductExport
 *
 * @apiError (400) The folllowing attributes do not exist
 * @apiError (401) Unauthorized - Must be admin
 * @apiError (404) Transaction not found
 *
 * @apiSuccess (200) {String} Successfully updated product export entry
 */
router.put('/:uuid', async (req, res) => {
  // TODO
  res.status(StatusCode.OK).send('Successfully updated product export');
}, authorized(UserType.ADMIN));

export default router;
