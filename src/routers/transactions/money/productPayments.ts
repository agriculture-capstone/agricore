
import createRouter from '@/utilities/functions/createRouter';
import authorized from '@/middleware/authorized';
import { UserType } from '@/models/User/UserType';
import { StatusCode } from '@/models/statusCodes';

const router = createRouter();

router.get('/', async (req, res) => {
  res.status(StatusCode.OK).send('Successfully retrieved all product payments') ;
}, authorized(UserType.ADMIN));

router.post('/', async (req, res) => {
  res.status(StatusCode.CREATED).send('Successfully created new product payment');
}, authorized(UserType.ADMIN));

router.put('/:uuid', async (req, res) => {
  res.status(StatusCode.OK).send('Successfully updated product payment');
}, authorized(UserType.ADMIN));

export default router;
