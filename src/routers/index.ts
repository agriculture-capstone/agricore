import { Router } from 'express';

import authentication from '@/routers/authentication';
import people from '@/routers/people';
import peopleCategories from '@/routers/peopleCategories';
import products from '@/routers/products';
import transactions from '@/routers/transactions/';
import productExports from '@/routers/productExports';

const router = Router();

router.use('/actions/authentication', authentication);
router.use('/people', people);
router.use('/peopleCategories', peopleCategories);
router.use('/products', products);
router.use('/transactions', transactions);
router.use('/productExports', productExports);

export default router;
