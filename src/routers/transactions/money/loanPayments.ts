
import createRouter from '@/utilities/functions/createRouter';
import authorized from '@/middleware/authorized';
import { UserType } from '@/models/User/UserType';
import { StatusCode } from '@/models/statusCodes';

const router = createRouter();

router.get('/', async (req, res) => {
  // TODO
  res.status(StatusCode.OK).send('Successfully retrieved all loan payments') ;
}, authorized(UserType.ADMIN));

router.post('/', async (req, res) => {
  // TODO
  res.status(StatusCode.CREATED).send('Successfully created new loan payment');
}, authorized(UserType.ADMIN));

router.put('/:uuid', async (req, res) => {
  // TODO
  res.status(StatusCode.OK).send('Successfully updated loan payment');
}, authorized(UserType.ADMIN));

export default router;
