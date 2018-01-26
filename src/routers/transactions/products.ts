import * as express from 'express';

import createRouter from '@/utilities/functions/createRouter';
import authorized from '@/middleware/authorized';
import { UserType } from '@/models/User/UserType';

import { StatusCode } from '@/models/statusCodes';

const router = createRouter();

/**
 * @api {get} /transactions/products/<type>
 * @apiDescription Returns all product transactions of a specified type
 *              and all their associated attributes.
 *              Guaranteed fields are:
 *                - productTransactionUuid
 *                - datetime
 *                - toPersonUuid
 *                - fromPersonUuid
 *                - amountOfProduct
 *                - productUnits
 *                - costPerUnit
 *                - currency
 *              Parameters have no effect on this request.
 *              Associated attributes can be checked via /products/<type>
 * @apiName GetAllProductTypeTransactions
 *
 * @apiError (401) Unauthorized - Must be admin
 *
 * @apiSuccess (200) {String} Successfully retrieved all <type> transactions
 * @apiSuccessExample Success-Response:
  [
    {
      "productTransactionUuid": "3cad5e7c-5444-4de1-aa81-a7d15acb35f1",
      "datetime": "2018-01-23 04:05:06",
      "toPersonUuid": "1a37d70e-ea33-41fc-bff7-273fb673697b",
      "fromPersonUuid": "5bf317ab-9c19-407c-b029-cb8c83998bd0",
      "amountOfProduct": 32.2123,
      "productUnits": "litres",
      "costPerUnit": "22.23",
      "currency": "UGX",
      "density": "55",
    }
  ]
 */
router.get('/:type', async (req, res) => {
  res.status(StatusCode.OK).send('Successfully retrieved all product <type> transactions');
}, authorized(UserType.ADMIN));

/**
 * @api {post} /transactions/products/<type>
 * @apiDescription Returns all product transactions of a specified type.
 *              Required fields are:
 *                - datetime
 *                - toPersonUuid
 *                - fromPersonUuid
 *                - amountOfProduct
 *                - costPerUnit
 *                - currency
 *                Along with any associated attributes.
 *                Associated attirubtes can be checked via /products
 *                The product transaction UUID is returned on success.
 *
 * @apiName CreateNewProductTransaction
 *
 * @apiError (400) The required fields are invalid or missing, ...
 * @apiError (401) Unauthorized - Must be admin
 *
 * @apiSuccess (201) {String} Successfully created new <type> transaction
 * @apiSuccessExample Success-Response:
  {
    "productTransactionUuid": "3cad5e7c-5444-4de1-aa81-a7d15acb35f1",
  }
 */
router.post('/:type', async (req, res) => {
  res.status(StatusCode.CREATED).send('Successfully created new product <type> transaction');
}, authorized(UserType.ADMIN));

/**
 * @api {put} /transactions/products/<type>/<uuid>
 * @apiDescription Updates a product transaction.
 *              Available fields are:
 *                - datetime
 *                - toPersonUuid
 *                - fromPersonUuid
 *                - productTypeId
 *                - amountOfProduct
 *                - costPerUnit
 *                - currency
 *                Along with any associated attributes.
 *                Associated attirubtes can be checked via /products
 *
 * @apiName UpdateProductTransaction
 *
 * @apiError (400) The fields are invalid, ...
 * @apiError (401) Unauthorized - Must be admin
 * @apiError (404) The product transaction has not been found.
 *
 * @apiSuccess (200) {String} Successfully updated <type> transaction
 */
router.put('/:type/:uuid', async (req, res) => {
  res.status(StatusCode.OK).send('Product <type> transaction updated');
}, authorized(UserType.ADMIN));


export default router;
