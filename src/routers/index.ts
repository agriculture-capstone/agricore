import { Router } from 'express';

import authentication from '@/routers/authentication';
import people from '@/routers/people';
import transactions from '@/routers/transactions/';
import productExports from '@/routers/productExports';
import productExports from '@/routers/products';

const router = Router();

router.use('/actions/authentication', authentication);
router.use('/people', people);
router.use('/transactions', transactions);
router.use('/productExports', productExports);
router.use('/products', products);

export default router;
