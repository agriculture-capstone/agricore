import { Router } from 'express';

import authenticate from '@/routers/actions/authenticate';
import people from '@/routers/people';
import products from '@/routers/products';
import transactions from '@/routers/transactions/';
import productExports from '@/routers/productExports';
import memos from '@/routers/memos';
import productPayments from '@/routers/transactions/money/productPayments';

const router = Router();

router.use('/actions/authenticate', authenticate);
router.use('/people', people);
router.use('/products', products);
router.use('/transactions', transactions);
router.use('/productExports', productExports);
router.use('/memos', memos);
router.use('/productPayments', productPayments);

export default router;
