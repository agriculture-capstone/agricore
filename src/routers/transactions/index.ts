import * as express from 'express';

import createRouter from '@/utilities/functions/createRouter';
import authorized from '@/middleware/authorized';
import { UserType } from '@/models/User/UserType';

import money from '@/routers/transactions/money/index';
import products from '@/routers/transactions/products';

import { StatusCode } from '@/models/statusCodes';

const router = createRouter();

router.use('/money', money);
router.use('/products', products);

export default router;
