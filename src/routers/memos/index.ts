import createRouter from '@/utilities/functions/createRouter';
import { StatusCode } from '@/models/statusCodes';

const router = createRouter();

/**
 * @api {get} /memos Get All Memos
 * @apiName GetMemos
 * @apiGroup Memos
 * @apiVersion  0.0.1
 * @apiDescription Returns all memos.
 *
 * @apiError (403) Forbidden Current user type does not have sufficient privileges.
 *
 * @apiSuccess (200) {String} Success Successfully retrieved all memos
 * @apiSuccessExample /memos Success-Response:
  [
    {
      "memoUuid": "1e167b81-d816-497b-8c0c-36f4d6b2fd33",
      "authorUuid": "425825a2-1e6f-4cfb-b612-e9933bf6c28e"
      "authorName": "Billy Bob"
      "message": "A truly inspiring memo",
      "datePosted": "2018-01-23 04:05:06.123Z"
    },
    {
      "memoUuid": "4b3f23a3-04c4-468f-bdf5-f189a34d9f69",
      "authorUuid": "425825a2-1e6f-4cfb-b612-e9933bf6c28e",
      "authorName": "Andy Angst",
      "message": "This is an even more amazing memo!"
      "datePosted": "2018-01-23 04:05:06.123Z"
    }
  ]
 */
router.get('/', async (req, res) => {
  res.status(StatusCode.OK).send('Not implemented');
});

/**
 * @api {post} /memos Create New Memo Entry
 * @apiName CreateMemo
 * @apiGroup Memos
 * @apiVersion  0.0.1
 * @apiDescription Creates a memo. Only admins can create memos.
 *
 * @apiParam [String] memoUuid Optionally provide the UUID that the memo should have.
 * @apiParam {String} authorUuid The UUID of the poster, the author of the memo.
 * @apiParam {String} message The message that the memo contains.
 * @apiParam {String} datePosted The date that the memo was created.
 *
 * @apiError (400) BadRequest Missing or invalid fields, ...
 * @apiError (403) Forbidden Current user type does not have sufficient privileges.
 *
 * @apiSuccess (201) {String} Success Successfully created memo
 * @apiSuccessExample /memos Success-Response:
 * { memoUuid: "1e167b81-d816-497b-8c0c-36f4d6b2fd33" }
 */
router.post('/:category', async (req, res) => {
  res.status(StatusCode.OK).send('Not implemented');
});

export default router;
