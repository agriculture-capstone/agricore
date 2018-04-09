import createRouter from '@/utilities/functions/createRouter';
import { authenticate } from '@/services/authentication/authenticate';
import logger from '@/utilities/modules/logger';
import { StatusCode } from '@/models/statusCodes';

const router = createRouter();

/**
 * @api {post} /actions/authenticate Authenticate
 * @apiName Authenticate
 * @apiGroup Authentication
 * @apiVersion  0.0.1
 *
 *
 * @apiParam {String} username Username of account to login
 * @apiParam {String} password Password of account to login
 *
 * @apiSuccess (200) {json} token for JWT, uuid of authenticated user, and type of user 
 *
 * @apiParamExample  {json} Request-Example:
   {
       "username": "TooMuchMoney",
       "password": "Actua11yBroke"
   }
 *
 * @apiSuccessExample {type} Success-Response:
   {
       "token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
       "uuid":"98f0f127-6c7f-4641-b464-447e417318d8",
       "type":"admins"
   }
 */
router.post('/', (req, res) => {
  if (!req.body.password || !req.body.username) {
    res.sendStatus(StatusCode.BAD_REQUEST);
    return;
  }

  authenticate(req.body.username, req.body.password)
    // Unauthorized
    .catch((err) => {
      res.sendStatus(StatusCode.UNAUTHORIZED);
    })
    // Authorized
    .then((tokenAndUuid) => {
      res.status(StatusCode.OK).json(tokenAndUuid);
    })
    // Server error
    .catch((err) => {
      logger.debug(err);
      res.sendStatus(StatusCode.INTERNAL_SERVER_ERROR);
    });
});

/** Authentication Router */
export default router;
