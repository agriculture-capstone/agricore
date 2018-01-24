import * as express from 'express';

import createRouter from '@/utilities/functions/createRouter';
import authorized from '@/middleware/authorized';
import { UserType } from '@/models/User/UserType';

import { StatusCode } from '@/models/statusCodes';

const router = createRouter();

router.get('/', async (req, res) => {
  res.status(StatusCode.OK).send('Successfully retrieved all people');
}, authorized(UserType.ADMIN));

router.get('/:category', async (req, res) => {
  res.status(StatusCode.OK).send('Successfully retrieved all people of type <something>');
}, authorized(UserType.ADMIN));

router.post('/:category', async (req, res) => {
  res.status(StatusCode.CREATED).send('Successfully created new <type>');
}, authorized(UserType.ADMIN));

router.get('/:category/:uuid', async (req, res) => {
  res.status(StatusCode.OK).send('Successfully got <type>');
}, authorized(UserType.ADMIN));

router.put('/:category/:uuid', async (req, res) => {
  res.status(StatusCode.OK).send('Successfully updated <type>');
}, authorized(UserType.ADMIN));

export default router;
