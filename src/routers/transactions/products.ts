import * as express from 'express';

import createRouter from '@/utilities/functions/createRouter';
import authorized from '@/middleware/authorized';
import { UserType } from '@/models/User/UserType';

import { StatusCode } from '@/models/statusCodes';

const router = createRouter();

/**
 * @api {get} /transactions/products/:type Get Product Transactions
 * @apiName GetProductTransactions
 * @apiGroup Product Transactions
 * @apiVersion  0.0.1
 * @description Returns all product transactions of a specified type
 *              and all their associated attributes.
 *              Guaranteed fields are:
 *                - productTransactionUuid
 *                - lastModified
 *                - datetime
 *                - toPersonUuid
 *                - fromPersonUuid
 *                - amountOfProduct
 *                - productUnits
 *                - costPerUnit
 *                - currency
 *              Parameters have no effect on this request.
 *              Associated attributes can be checked via the /products API.
 *              An example of an associated attribute would be density, as
 *              in the example.
 *
 * @apiParam {String} type The type of product.
 *
 * @apiError (403) Forbidden Current user type does not have sufficient privileges.
 *
 * @apiSuccess (200) {String} Success Successfully retrieved all <type> transactions
 * @apiSuccessExample Success-Response:
  [
    {
      "productTransactionUuid": "3cad5e7c-5444-4de1-aa81-a7d15acb35f1",
      "lastModified": "2018-01-23 04:05:06.123Z"
      "datetime": "2018-01-23 04:05:06Z",
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
 * @api {post} /transactions/products/:type Create Product Transactions
 * @apiName CreateProductTransactions
 * @apiGroup Product Transactions
 * @apiVersion  0.0.1
 * @description Creates a new product transactions of a specified type.
 *              The product transaction UUID is returned on success.
 *
 * @apiParam {String} type The type of product.
 * @apiParam {String} datetime The time this transaction was conducted.
 *                    It value must be in UTC or the request will be rejected.
 * @apiParam {String} toPersonUuid The UUID of the person receiving the product.
 * @apiParam {String} fromPersonUuid The UUID of the person giving the product.
 * @apiParam {Number} amountOfProduct The amount of a product in it's given units.
                      The product's units can be checked via /product.
 * @apiParam {Number} costPerUnit The agreed cost of one unit of the product.
                      The currency given in the currency parameter of this request.
                      The product's units can be checked via /product.
 * @apiParam {String} currency An attribute of a person with its value.
 * @apiParam {String} attributes An attribute of a product with its value.
 *                    All necessary attributes can be checked in the /product API.
 *                    All attributes must be provided in separate params.
 *
 * @apiError (400) BadRequest The required fields are invalid or missing, ...
 * @apiError (403) Forbidden Current user type does not have sufficient privileges.
 *
 * @apiSuccess (201) {String} Success Successfully created new <type> transaction
 * @apiSuccessExample Success-Response:
  {
    "productTransactionUuid": "3cad5e7c-5444-4de1-aa81-a7d15acb35f1",
  }
 */
router.post('/:type', async (req, res) => {
  res.status(StatusCode.CREATED).send('Successfully created new product <type> transaction');
}, authorized(UserType.ADMIN));

/**
 * @api {put} /transactions/products/:type/:uuid Update Product Transaction
 * @apiName UpdateProductTransaction
 * @apiGroup Product Transactions
 * @apiVersion  0.0.1
 * @description Updates a product transaction.
 *              Available fields are:
 *                - datetime
 *                - toPersonUuid
 *                - fromPersonUuid
 *                - productTypeId
 *                - amountOfProduct
 *                - costPerUnit
 *                - currency
 *                Along with any associated attributes such as density.
 *                Associated attributes can be checked via /products
 *                Returns the transaction's actual data on error.
 *
 * @apiParam {String} type The type of product.
 * @apiParam {String} uuid The uuid of the product transaction.
 * @apiParam {String} [attributes] An attribute of a product with its value.
 *                    Some available attributes are datetime, toPersonUuid, fromPersonUuid,
 *                    productTypeId, amountOfProduct, costPerUnit, and currency.
 *                    Other available attributes can be checked in the /product API.
 *                    All attributes must be provided in separate params.
 *
 * @apiError (400) BadRequest The following fields are invalid, ...
 *                 The product transaction's actual data is returned in JSON format.
 * @apiError (404) NotFound The product transaction has not been found.
 *
 * @apiSuccess (200) {String} Success Successfully updated <type> transaction
 */
router.put('/:type/:uuid', async (req, res) => {
  res.status(StatusCode.OK).send('Product <type> transaction updated');
}, authorized(UserType.ADMIN));


export default router;
