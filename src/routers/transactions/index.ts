
import createRouter from '@/utilities/functions/createRouter';

import money from '@/routers/transactions/money/';
import products from '@/routers/transactions/products';


const router = createRouter();

router.use('/money', money);
router.use('/products', products);

export default router;
