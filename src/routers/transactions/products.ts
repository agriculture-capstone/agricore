import * as express from 'express';

import createRouter from '@/utilities/functions/createRouter';
import authorized from '@/middleware/authorized';
import { UserType } from '@/models/User/UserType';

import { StatusCode } from '@/models/statusCodes';

const router = createRouter();

router.get('/:type', async (req, res) => {
  res.status(StatusCode.OK).send('Successfully retrieved all product <type> transactions');
}, authorized(UserType.ADMIN));

router.post('/:type', async (req, res) => {
  res.status(StatusCode.CREATED).send('Successfully created new product <type> transaction');
}, authorized(UserType.ADMIN));

router.put('/:type/:uuid', async (req, res) => {
  res.status(StatusCode.OK).send('Product <type> transaction updated');
}, authorized(UserType.ADMIN));


export default router;
