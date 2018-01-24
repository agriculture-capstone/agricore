import * as express from 'express';

import createRouter from '@/utilities/functions/createRouter';
import authorized from '@/middleware/authorized';
import { UserType } from '@/models/User/UserType';

import money from '@/routers/transactions/money';
import products from '@/routers/transactions/products';
import loans from '@/routers/transactions/loans';
import loanPayments from '@/routers/transactions/loanPayments';

import { StatusCode } from '@/models/statusCodes';

const router = createRouter();

router.use('/money', money);
router.use('/products', products);
router.use('/loans', loans);
router.use('/loanPayments', loanPayments);

export default router;
