import createRouter from '@/utilities/functions/createRouter';
import * as LoansService from '@/services/transactions/loans';

import authorized from '@/middleware/authorized';
import { UserType } from '@/models/User/UserType';
import { StatusCode } from '@/models/statusCodes';
import { MoneyTransaction, MoneyTransactionCreationReq, MoneyTransactionUpdateReq} from '../money/';
const router = createRouter();

/** Represents a loan in the API */
export interface Loan extends MoneyTransaction {
  dueDate: string;
}

/**
 * Represent a loan used in an INSERT call on the database
 */
export interface LoanCreationReq extends MoneyTransactionCreationReq {
  dueDate: string;
}

/**
 * Represent a loan used in an UPDATE call on the database
 */
export interface LoanUpdateReq extends MoneyTransactionUpdateReq {
  dueDate?: string;
}

/**
 * @api {get} /transactions/money/loans Get all loans
 * @apiName GetLoans
 * @apiGroup Loans
 * @apiVersion  0.0.1
 * @apiDescription Returns all loans
 *
 * @apiError (403) Forbidden Current user type does not have sufficient privileges.
 *
 * @apiSuccess (200) {String} Success Successfully retrieved all loans
 * @apiSuccessExample /transactions/money/loans Success-Response:
  [
    {
      "uuid": "9f11efb5-d5b4-4853-aa88-ee10c2940c9f",
      "dueDate": "2018-01-23 04:06:06.000Z",
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
      "dueDate": "2018-01-23 04:06:06.000Z",
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
  const result = await LoansService.getLoansFromDb();
  res.status(StatusCode.OK).send(result);
}, authorized(UserType.ADMIN, UserType.TRADER, UserType.MONITOR));

/**
 * @api {post} /laons
 * @apiName CreateLoan
 * @apiGroup Loans
 * @apiVersion 0.0.1
 * @apiDescription Creates a new loan entry.
 *
 * @apiParam {String} uuid The UUID of the new loan.
 * @apiParam {String} dueDate The date that the loan should be repaid by.
 * @apiParam {String} datetime The date that the loan was given.
 * @apiParam {String} toPersonUuid The person receiving the loan.
 * @apiParam {String} fromPersonUuid The person giving the loan.
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
  const createReq: LoanCreationReq = {
    uuid: req.body.uuid,
    dueDate: req.body.dueDate,
    datetime: req.body.datetime,
    toPersonUuid: req.body.toPersonUuid,
    fromPersonUuid: req.body.fromPersonUuid,
    amount: req.body.amount,
    currency: req.body.currency,
  };

  try {
    const uuid = await LoansService.createLoanInDb(createReq);
    res.status(StatusCode.CREATED).send({ uuid });
  } catch (e) {
    if (e.message === LoansService.unhandledErrorMsg) {
      res.status(StatusCode.INTERNAL_SERVER_ERROR).send();
    } else {
      res.status(StatusCode.BAD_REQUEST).send('BadRequest ' + e.message);
    }
  }
}, authorized(UserType.ADMIN, UserType.TRADER));

/**
 * @api {put} /transactions/money/loans/:uuid
 * @apiName UpdateLoan
 * @apiGroup Loans
 * @apiVersion 0.0.1
 * @apiDescription Updates a loan entry.
 *              Any fields not given will not be updated.
 *              Extra non existent fields will not be ignored.
 *              Returns the loan's actual data on error or success.
 *
 * @apiParam {String} uuid The UUID of the loan to update.
 * @apiParam {String} dueDate The date that the loan should be repaid by.
 * @apiParam {String} datetime The date that the loan was given.
 * @apiParam {String} toPersonUuid The person receiving the loan.
 * @apiParam {String} fromPersonUuid The person giving the loan.
 * @apiParam {Number} amount The amount of money exchanged.
 * @apiParam {String} currency The currency type of the amount exchanged, such as UGX.
 *
 * @apiError (403) Forbidden Current user type does not have sufficient privileges.
 * @apiError (404) NotFound Product export not found
 *
 * @apiSuccess (200) {String} Successfully updated loan entry
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
  const updateReq: LoanUpdateReq = {
    uuid: req.params.uuid,

    // optional parameters
    dueDate: req.body.dueDate,
    datetime: req.body.datetime,
    toPersonUuid: req.body.toPersonUuid,
    fromPersonUuid: req.body.fromPersonUuid,
    amount: req.body.amount,
    currency: req.body.currency,
  };

  try {
    await LoansService.updateLoanInDb(updateReq);
    const result = await LoansService.getLoanFromDb(req.params.uuid);
    res.status(StatusCode.OK).send(result);
  } catch (e) {
    const result = await LoansService.getLoanFromDb(req.params.uuid);
    res.status(StatusCode.INTERNAL_SERVER_ERROR).send(result);
  }
}, authorized(UserType.ADMIN, UserType.TRADER));

export default router;
