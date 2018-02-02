import createRouter from '@/utilities/functions/createRouter';
import authorized from '@/middleware/authorized';
import { UserType } from '@/models/User/UserType';
import * as ProdTransactionsService from '@/services/ProductTransactions';


import { StatusCode } from '@/models/statusCodes';

/**
 * Represents a product transaction in the API
 */
export interface ProdTransaction {
  uuid: string;
  productType: string;
  productUnits: string;
  datetime: string;
  toPersonUuid: string;
  fromPersonUuid: string;
  amountOfProduct: number;
  costPerUnit: number;
  currency: string;
  lastModified: string;

  milkQuality?: string;
}

export interface ProdTransactionReq {
  productType: string;
  datetime: string;
  toPersonUuid: string;
  fromPersonUuid: string;
  amountOfProduct: number;
  costPerUnit: number;
  currency: string;

  milkQuality?: string;
}

const router = createRouter();

/**
 * @api {get} /transactions/products/:type Get Product Transactions
 * @apiName GetProductTransactions
 * @apiGroup Product Transactions
 * @apiVersion  0.0.1
 * @apiDescription Returns all product transactions of a specified type
 *              and all their associated attributes.
 *              Guaranteed fields are:
 *                - uuid
 *                - productType
 *                - productUnits
 *                - datetime
 *                - toPersonUuid
 *                - fromPersonUuid
 *                - amountOfProduct
 *                - costPerUnit
 *                - currency
 *                - lastModified
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
      "uuid":"0464e508-31fa-4c47-ab2d-56496c6518e4",
      "productType":"milk",
      "productUnits":"litres",
      "datetime":"2017-01-15T00:57:43.959Z",
      "toPersonUuid":"a293e3a5-a88d-473b-9d4a-74a2153992f6",
      "fromPersonUuid":"ca225efc-fc3c-4dcb-b2e0-ae466c9b20c9",
      "amountOfProduct":995.341,
      "costPerUnit":"14.46",
      "currency":"UGX",
      "lastModified":"2017-09-29T20:00:04.596Z",
      "milkQuality":"242.4"
    }
  ]
 */
router.get('/:type', async (req, res) => {
  const result = await ProdTransactionsService.getProdTransactionsFromDb(req.params.type);
  res.status(StatusCode.OK).send(result);
});

/**
 * @api {post} /transactions/products/:type Create Product Transactions
 * @apiName CreateProductTransactions
 * @apiGroup Product Transactions
 * @apiVersion  0.0.1
 * @apiDescription Creates a new product transactions of a specified type.
 *              The product transaction UUID is returned on success.
 *
 * @apiParam {String} type The type of product.
 * @apiParam {String} datetime The time this transaction was conducted.
 *                    It's value must be in UTC or the request will be rejected.
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
  const createReq: ProdTransactionReq = {
    productType: req.params.type,
    datetime: req.body.datetime,
    toPersonUuid: req.body.toPersonUuid,
    fromPersonUuid: req.body.fromPersonUuid,
    amountOfProduct: req.body.amountOfProduct,
    costPerUnit: req.body.costPerUnit,
    currency: req.body.currency,
  };

  if (req.body.milkQuality) {
    createReq.milkQuality = req.body.milkQuality;
  }

  const uuid = await ProdTransactionsService.createProdTransactionsInDb(createReq);
  res.status(StatusCode.CREATED).send({ uuid });
});

/**
 * @api {put} /transactions/products/:type/:uuid Update Product Transaction
 * @apiName UpdateProductTransaction
 * @apiGroup Product Transactions
 * @apiVersion  0.0.1
 * @apiDescription Updates a product transaction.
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
