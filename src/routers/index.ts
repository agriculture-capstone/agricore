import { Router } from 'express';

import authenticate from '@/routers/actions/authenticate';
import people from '@/routers/people';
import products from '@/routers/products';
import transactions from '@/routers/transactions/';
import productExports from '@/routers/productExports';

const router = Router();

router.use('/actions/authenticate', authenticate);
router.use('/people', people);
router.use('/products', products);
router.use('/transactions', transactions);
router.use('/productExports', productExports);
router.use('/products', products);

export default router;
