import { Router } from 'express';

import authentication from '@/routers/authentication';
import account from '@/routers/account';

const router = Router();
const apiRouter = Router();

// Setup authentication
router.use('/authentication', authentication);

// Setup API routes
apiRouter.use('/account', account);
// add our apis here

// Use API Router
router.use('/api', apiRouter);

export default router;
