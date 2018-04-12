import createRouter from '@/utilities/functions/createRouter';
import * as ProductPaymentsService from '@/services/transactions/productPayments';

import authorized from '@/middleware/authorized';
import { UserType } from '@/models/User/UserType';
import { StatusCode } from '@/models/statusCodes';
import { MoneyTransaction, MoneyTransactionCreationReq, MoneyTransactionUpdateReq } from '../money/';

const router = createRouter();

/** Represents a product payment in the API */
export interface ProductPayment extends MoneyTransaction {
  productTransactionUuid: string;
}

/**
 * Represent a product payment used in an INSERT call on the database
 */
export interface ProductPaymentCreationReq extends MoneyTransactionCreationReq {
  productTransactionUuid: string;
}

/**
 * Represent a product payment used in an UPDATE call on the database
 */
export interface ProductPaymentUpdateReq extends MoneyTransactionUpdateReq {
  productTransactionUuid: string;
}

/**
 * @api {get} /transactions/money/productPayments Get all productPayments
 * @apiName GetProductPayments
 * @apiGroup ProductPayments
 * @apiVersion  0.0.1
 * @apiDescription Returns all productPayments
 *
 * @apiError (403) Forbidden Current user type does not have sufficient privileges.
 *
 * @apiSuccess (200) {String} Success Successfully retrieved all productPayments
 * @apiSuccessExample /transactions/money/productPayments Success-Response:
  [
    {
      "uuid": "9f11efb5-d5b4-4853-aa88-ee10c2940c9f",
      "productTransactionUuid": "1231efb5-d5b4-4853-aa88-ee10c2940c9f",
      "datetime": "2018-01-23 04:05:06.000Z",
      "toPersonUuid": "a293e3a5-a88d-473b-9d4a-74a2153992f6",
      "fromPersonUuid": "2232a3a5-a99d-473b-9d4a-74a2153993b2",
      "amount": 10.22
      "currency": "UGX"
      "toPersonName": "John Lucky Smith",
      "fromPersonName": "Sharon Hello World"
      "lastModified": "2018-01-23 04:05:06.000Z",
    },
    {
      "uuid": "7359efb5-d5b4-4853-aa88-ee10c2940ab3",
      "productTransactionUuid": "1239efb5-d5b4-4853-aa88-ee10c2940ab3",
      "datetime": "2018-01-23 04:05:06.000Z",
      "toPersonUuid": "2648e3a5-a88d-473b-9d4a-74a2153970a4",
      "fromPersonUuid": "dc25a3a5-a99d-473b-9d4a-74a21539ff24",
      "amount": 10.22
      "currency": "UGX"
      "toPersonName": "Jerry Morton",
      "fromPersonName": "Joey Goold"
      "lastModified": "2018-01-23 04:05:06.000Z",
    }
  ]
 */
router.get('/', async (req, res) => {
  const result = await ProductPaymentsService.getProductPaymentsFromDb();
  res.status(StatusCode.OK).send(result);
}, authorized(UserType.ADMIN, UserType.TRADER, UserType.MONITOR));

/**
 * @api {post} /transactions/money/productPayments
 * @apiName CreateProductPayment
 * @apiGroup ProductPayments
 * @apiVersion 0.0.1
 * @apiDescription Creates a new productPayment entry.
 *
 * @apiParam {String} uuid The UUID of the new productPayment.
 * @apiParam {String} productTransactionUuid The UUID of the product transaction this payment is related to.
 * @apiParam {String} datetime The date that the productPayment was given.
 * @apiParam {String} toPersonUuid The person receiving the productPayment.
 * @apiParam {String} fromPersonUuid The person giving the productPayment.
 * @apiParam {Number} amount The amount of money exchanged.
 * @apiParam {String} currency The currency type of the amount exchanged, such as UGX.
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
  const createReq: ProductPaymentCreationReq = {
    uuid: req.body.uuid,
    productTransactionUuid: req.body.productTransactionUuid,
    datetime: req.body.datetime,
    toPersonUuid: req.body.toPersonUuid,
    fromPersonUuid: req.body.fromPersonUuid,
    amount: req.body.amount,
    currency: req.body.currency,
  };

  try {
    const uuid = await ProductPaymentsService.createProductPaymentInDb(createReq);
    res.status(StatusCode.CREATED).send({ uuid });
  } catch (e) {
    if (e.message === ProductPaymentsService.unhandledErrorMsg) {
      res.status(StatusCode.INTERNAL_SERVER_ERROR).send();
    } else {
      res.status(StatusCode.BAD_REQUEST).send('BadRequest ' + e.message);
    }
  }
}, authorized(UserType.ADMIN, UserType.TRADER));

/**
 * @api {put} /transactions/money/productPayments/:uuid
 * @apiName UpdateProductPayment
 * @apiGroup ProductPayments
 * @apiVersion 0.0.1
 * @apiDescription Updates a productPayment entry.
 *              Any fields not given will not be updated.
 *              Extra non existent fields will not be ignored.
 *              Returns the productPayment's actual data on error or success.
 *
 * @apiParam {String} uuid The UUID of the productPayment to update.
 * @apiParam [String] productTransactionUuid The UUID of the product transaction this payment is related to.
 * @apiParam [String] datetime The date that the productPayment was given.
 * @apiParam [String] toPersonUuid The person receiving the productPayment.
 * @apiParam [String] fromPersonUuid The person giving the productPayment.
 * @apiParam [Number] amount The amount of money exchanged.
 * @apiParam [String] currency The currency type of the amount exchanged, such as UGX.
 *
 * @apiError (403) Forbidden Current user type does not have sufficient privileges.
 * @apiError (404) NotFound Product export not found
 *
 * @apiSuccess (200) {String} Successfully updated productPayment entry
   {
    "uuid": "7359efb5-d5b4-4853-aa88-ee10c2940ab3",
    "productTransactionUuid": "1231efb5-d5b4-4853-aa88-ee10c2940c9f",
    "datetime": "2018-01-23 04:05:06.000Z",
    "toPersonUuid": "2648e3a5-a88d-473b-9d4a-74a2153970a4",
    "fromPersonUuid": "dc25a3a5-a99d-473b-9d4a-74a21539ff24",
    "amount": 10.22
    "currency": "UGX"
    "toPersonName": "Jerry Morton",
    "fromPersonName": "Joey Goold"
   }
*/
router.put('/:uuid', async (req, res) => {
  const updateReq: ProductPaymentUpdateReq = {
    uuid: req.params.uuid,

    // optional parameters
    productTransactionUuid: req.body.productTransactionUuid,
    datetime: req.body.datetime,
    toPersonUuid: req.body.toPersonUuid,
    fromPersonUuid: req.body.fromPersonUuid,
    amount: req.body.amount,
    currency: req.body.currency,
  };

  try {
    await ProductPaymentsService.updateProductPaymentInDb(updateReq);
    const result = await ProductPaymentsService.getProductPaymentFromDb(req.params.uuid);
    res.status(StatusCode.OK).send(result);
  } catch (e) {
    const result = await ProductPaymentsService.getProductPaymentFromDb(req.params.uuid);
    res.status(StatusCode.INTERNAL_SERVER_ERROR).send(result);
  }
}, authorized(UserType.ADMIN, UserType.TRADER));

export default router;
