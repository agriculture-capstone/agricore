import * as express from 'express';

import createRouter from '@/utilities/functions/createRouter';
import authorized from '@/middleware/authorized';
import { UserType } from '@/models/User/UserType';

import { StatusCode } from '@/models/statusCodes';

const router = createRouter();

router.get('/', async (req, res) => {
  res.status(StatusCode.OK).send('Successfully retrieved all money transactions');
}, authorized(UserType.ADMIN));

router.get('/:uuid', async (req, res) => {
  res.status(StatusCode.OK).send('Successfully retrieved money transaction');
}, authorized(UserType.ADMIN));


export default router;
