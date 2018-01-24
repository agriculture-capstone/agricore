import * as express from 'express';

import createRouter from '@/utilities/functions/createRouter';
import authorized from '@/middleware/authorized';
import { UserType } from '@/models/User/UserType';
import { StatusCode } from '@/models/statusCodes';

import loans from '@/routers/transactions/money/loans';
import loanPayments from '@/routers/transactions/money/loanPayments';
import productPayments from '@/routers/transactions/money/productPayments';

const router = createRouter();

router.get('/', async (req, res) => {
  res.status(StatusCode.OK).send('Successfully retrieved all money transactions');
}, authorized(UserType.ADMIN));

router.get('/:uuid', async (req, res) => {
  res.status(StatusCode.OK).send('Successfully retrieved money transaction');
}, authorized(UserType.ADMIN));

router.use('/loans', loans)
router.use('/loanPayments', loanPayments)
router.use('/productPayments', productPayments)

export default router;
