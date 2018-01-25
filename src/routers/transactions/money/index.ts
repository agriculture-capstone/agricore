import * as express from 'express';

import createRouter from '@/utilities/functions/createRouter';
import authorized from '@/middleware/authorized';
import { UserType } from '@/models/User/UserType';
import { StatusCode } from '@/models/statusCodes';

import loans from '@/routers/transactions/money/loans';
import loanPayments from '@/routers/transactions/money/loanPayments';
import productPayments from '@/routers/transactions/money/productPayments';

const router = createRouter();

/**
 * @api {get} /transactions/money
 * @description Returns all money transactions.
 *              Parameters have no effect on this request.
 * @apiName GetAllMoneyTransactions
 *
 * @apiError (401) Unauthorized - Must be admin
 *
 * @apiSuccess (200) {String} Successfully retrieved all money transactions
 * @apiSuccessExample Success-Response:
  [
    {
      "moneyTransactionUuid": "43c542e4-443e-45fa-91d5-f073161eb216",
      "datetime": "2018-01-23 04:05:06",
      "toPersonUuid": "3cad5e7c-5444-4de1-aa81-a7d15acb35f1",
      "fromPersonUuid": "43c542e4-443e-45fa-91d5-f073161eb216",
      "amount": 223.42,
      "currency": "UGX"
    }
  ]
 */
router.get('/', async (req, res) => {
  res.status(StatusCode.OK).send('Successfully retrieved all money transactions');
}, authorized(UserType.ADMIN));

router.use('/loans', loans)
router.use('/loanPayments', loanPayments)
router.use('/productPayments', productPayments)

// dynamic api needs be after the static ones
/**
 * @api {get} /transactions/money/<uuid>
 * @description Returns a specific money transaction.
 *              Parameters have no effect on this request.
 * @apiName GetMoneyTransaction
 *
 * @apiError (401) Unauthorized - Must be admin
 * @apiError (404) Money transaction not found
 *
 * @apiSuccess (200) {String} Successfully retrieved money transaction
 * @apiSuccessExample Success-Response:
  {
    "moneyTransactionUuid": "43c542e4-443e-45fa-91d5-f073161eb216",
    "datetime": "2018-01-23 04:05:06",
    "toPersonUuid": "3cad5e7c-5444-4de1-aa81-a7d15acb35f1",
    "fromPersonUuid": "43c542e4-443e-45fa-91d5-f073161eb216",
    "amount": 223.42,
    "currency": "UGX"
  }
 */
router.get('/:uuid', async (req, res) => {
  res.status(StatusCode.OK).send('Successfully retrieved money transaction');
}, authorized(UserType.ADMIN));

export default router;
