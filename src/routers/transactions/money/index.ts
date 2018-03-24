import createRouter from '@/utilities/functions/createRouter';
import authorized from '@/middleware/authorized';
import { UserType } from '@/models/User/UserType';
import { StatusCode } from '@/models/statusCodes';

import loans from '@/routers/transactions/money/loans';
import loanPayments from '@/routers/transactions/money/loanPayments';
import productPayments from '@/routers/transactions/money/productPayments';
import * as MoneyTransactionsService from '@/services/transactions/money';

const router = createRouter();

router.use('/loans', loans);
router.use('/loanPayments', loanPayments);
router.use('/productPayments', productPayments);

/** Represents a moneyTransaction in the API */
export interface MoneyTransaction {
  uuid: string;
  datetime: string;
  toPersonUuid: string;
  fromPersonUuid: string;
  amount: number;
  currency: string;
  toPersonName: string;
  fromPersonName: string;
  lastModified: string;
}

/**
 * Represent a moneyTransaction used in an INSERT call on the database
 */
export interface MoneyTransactionCreationReq {
  uuid: string;
  datetime: string;
  toPersonUuid: string;
  fromPersonUuid: string;
  amount: number;
  currency: string;
}

/**
 * Represent a moneyTransaction used in an UPDATE call on the database
 */
export interface MoneyTransactionUpdateReq {
  uuid: string;
  datetime?: string;
  toPersonUuid?: string;
  fromPersonUuid?: string;
  amount?: number;
  currency?: string;
}

/**
 * @api {get} /transactions/money Get all loans
 * @apiName GetMoneyTransactions
 * @apiGroup MoneyTransactions
 * @apiVersion  0.0.1
 * @apiDescription Returns all loans
 *
 * @apiError (403) Forbidden Current user type does not have sufficient privileges.
 *
 * @apiSuccess (200) {String} Success Successfully retrieved all loans
 * @apiSuccessExample /transactions/money Success-Response:
  [
    {
      "uuid": "9f11efb5-d5b4-4853-aa88-ee10c2940c9f",
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
  const result = await MoneyTransactionsService.getMoneyTransactionsFromDb();
  res.status(StatusCode.OK).send(result);
}, authorized(UserType.ADMIN, UserType.TRADER, UserType.MONITOR));

/**
 * @api {post} /laons
 * @apiName CreateMoneyTransaction
 * @apiGroup MoneyTransactions
 * @apiVersion 0.0.1
 * @apiDescription Creates a new moneyTransaction entry.
 *
 * @apiParam {String} uuid The UUID of the new moneyTransaction.
 * @apiParam {String} datetime The date that the moneyTransaction was given.
 * @apiParam {String} toPersonUuid The person receiving the moneyTransaction.
 * @apiParam {String} fromPersonUuid The person giving the moneyTransaction.
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
  const createReq: MoneyTransactionCreationReq = {
    uuid: req.body.uuid,
    datetime: req.body.datetime,
    toPersonUuid: req.body.toPersonUuid,
    fromPersonUuid: req.body.fromPersonUuid,
    amount: req.body.amount,
    currency: req.body.currency,
  };

  try {
    const uuid = await MoneyTransactionsService.createMoneyTransactionInDb(createReq);
    res.status(StatusCode.CREATED).send({ uuid });
  } catch (e) {
    if (e.message === MoneyTransactionsService.unhandledErrorMsg) {
      res.status(StatusCode.INTERNAL_SERVER_ERROR).send();
    } else {
      res.status(StatusCode.BAD_REQUEST).send('BadRequest ' + e.message);
    }
  }
}, authorized(UserType.ADMIN, UserType.TRADER));

/**
 * @api {put} /transactions/money/:uuid
 * @apiName UpdateMoneyTransaction
 * @apiGroup MoneyTransactions
 * @apiVersion 0.0.1
 * @apiDescription Updates a moneyTransaction entry.
 *              Any fields not given will not be updated.
 *              Extra non existent fields will not be ignored.
 *              Returns the moneyTransaction's actual data on error or success.
 *
 * @apiParam {String} uuid The UUID of the moneyTransaction to update.
 * @apiParam {String} dueDate The date that the moneyTransaction should be repaid by.
 * @apiParam {String} datetime The date that the moneyTransaction was given.
 * @apiParam {String} toPersonUuid The person receiving the moneyTransaction.
 * @apiParam {String} fromPersonUuid The person giving the moneyTransaction.
 * @apiParam {Number} amount The amount of money exchanged.
 * @apiParam {String} currency The currency type of the amount exchanged, such as UGX.
 *
 * @apiError (403) Forbidden Current user type does not have sufficient privileges.
 * @apiError (404) NotFound Product export not found
 *
 * @apiSuccess (200) {String} Successfully updated moneyTransaction entry
   {
    "uuid": "7359efb5-d5b4-4853-aa88-ee10c2940ab3",
    "dueDate": "2018-01-23 04:06:06.000Z",
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
  const updateReq: MoneyTransactionUpdateReq = {
    uuid: req.params.uuid,

    // optional parameters
    datetime: req.body.datetime,
    toPersonUuid: req.body.toPersonUuid,
    fromPersonUuid: req.body.fromPersonUuid,
    amount: req.body.amount,
    currency: req.body.currency,
  };

  try {
    await MoneyTransactionsService.updateMoneyTransactionInDb(updateReq);
    const result = await MoneyTransactionsService.getMoneyTransactionFromDb(req.params.uuid);
    res.status(StatusCode.OK).send(result);
  } catch (e) {
    const result = await MoneyTransactionsService.getMoneyTransactionFromDb(req.params.uuid);
    res.status(StatusCode.INTERNAL_SERVER_ERROR).send(result);
  }
}, authorized(UserType.ADMIN, UserType.TRADER));

export default router;
