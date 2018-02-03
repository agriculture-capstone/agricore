import createRouter from '@/utilities/functions/createRouter';
import authorized from '@/middleware/authorized';
import { UserType } from '@/models/User/UserType';
import * as PeopleDb from '@/database/people';

import { StatusCode } from '@/models/statusCodes';
import categories from './categories';
import logger from '@/utilities/modules/logger';

const router = createRouter();

/**
 * This should be done before the route allowing a path parameter is defined.
 * (ie. /:category)
 */
router.use('/categories', categories);

/**
 * @api {get} /people/:category Get All People in Category
 * @apiName GetPeopleInCategory
 * @apiGroup People
 * @apiVersion  0.0.1
 * @apiDescription Returns all people of this category and all their
 * 				         associated attributes and values.
 *                 Parameters have no effect on this request, but the URL
 *                 specifies what kind of people are given.
 *
 * @apiParam {String} category Specify the category of people to retrieve.
 *
 * @apiError (403) Forbidden Current user type does not have sufficient privileges.
 * @apiError (404) NotFound Person category not found
 *
 * @apiSuccess (200) {String} Success Successfully retrieved all people from category <category>
 * @apiSuccessExample /people/farmers Success-Response:
  [
    {
      "personUuid": "1e167b81-d816-497b-8c0c-36f4d6b2fd33",
      "lastModified": "2018-01-23 04:05:06.123Z"
      "firstName": "Zachariah",
      "paymentFrequency": "weekly",
      "notes": "Brother of Moses",
    },
    {
      "personUuid": "4b3f23a3-04c4-468f-bdf5-f189a34d9f69",
      "firstName": "Zachariah",
      "lastModified": "2018-01-23 04:05:06.123Z"
      "paymentFrequency": "monthly",
      "notes": "Has a nice car",
    }
  ]
 */
router.get('/:category', async (req, res) => {
  const result = await PeopleDb.getPeople(req.params.category);
  res.status(StatusCode.OK).send(result);
}, authorized(UserType.ADMIN));

/**
 * @api {post} /people/:category Create New Person Entry
 * @apiName CreatePerson
 * @apiGroup People
 * @apiVersion  0.0.1
 * @apiDescription Creates a new person in the specified category.
 *                 Returns the UUID created for that person.
 *                 Requires all associated attributes given in /people/categories
 *
 * @apiParam {String} category Specify the category of people to retrieve.
 * @apiParam {String} attributes An attribute of a person with its value.
 *                    All necessary attributes can be checked in the /people/categories API.
 *                    All attributes must be provided in separate params.
 *
 * @apiError (400) BadRequest Missing or invalid fields, ...
 * @apiError (403) Forbidden Current user type does not have sufficient privileges.
 *
 * @apiSuccess (201) {String} Success Successfully created person of category <category>
 * @apiSuccessExample /people/farmers Success-Response:
 * { personUuid: "1e167b81-d816-497b-8c0c-36f4d6b2fd33" }
 */
router.post('/:category', async (req, res) => {
  const requestParams = req.body; 
  // convert to lower case keys
  let response: any;
  try {
    response = await PeopleDb.insertPerson(req.params.category, req.body);
    res.status(StatusCode.CREATED).send(response);
  } catch (e) {
    logger.error(e.message && e.stack ? `${e.message}\n${e.stack}` : e);
    if (e.message === 'Bad request') {
      res.status(StatusCode.BAD_REQUEST).send('Invalid or missing field');
    } else {
      res.status(StatusCode.INTERNAL_SERVER_ERROR).send('Internal server error');
    }
  }
}, authorized(UserType.ADMIN));

/**
 * @api {get} /people/:category/:uuid Get Person
 * @apiName GetPerson
 * @apiGroup People
 * @apiVersion  0.0.1
 * @apiDescription Gets a particular person.
 *                 Parameters have no effect on this request.
 *
 * @apiParam {String} category Specify the category of the person.
 * @apiParam {String} uuid Specify the UUID of the person to retrieve.
 *
 * @apiError (403) Forbidden Current user type does not have sufficient privileges.
 * @apiError (404) NotFound Person not found in category <category>
 *
 * @apiSuccess (200) {String} Success Successfully retrieved person
 * @apiSuccessExample /people/farmers/1e167b81-d816-497b-8c0c-36f4d6b2fd33 Success-Response:
   {
     "personUuid": "1e167b81-d816-497b-8c0c-36f4d6b2fd33",
     "lastModified": "2018-01-23 04:05:06.123Z"
     "firstName": "Zachariah",
     "paymentFrequency": "weekly",
     "notes": "Brother of Moses",
   }
 */
router.get('/:category/:uuid', async (req, res) => {
  res.status(StatusCode.OK).send('Successfully got <category>');
}, authorized(UserType.ADMIN));

/**
 * @api {put} /people/:category/:uuid Update Person
 * @apiName UpdatePerson
 * @apiGroup People
 * @apiVersion  0.0.1
 * @apiDescription Updates a specific person for the given attributes.
 *                 Associated attributes can be checked via /peopleCategories
 *
 * @apiParam {String} category Specify the category of the person.
 * @apiParam {String} uuid Specify the UUID of the person to update.
 * @apiParam {String} [attributes] An attribute of a person with its value.
 *                    All available attributes can be checked in the /peopleCategories API.
 *                    Multiple attributes maybe provided.
 *
 * @apiError (400) BadRequest Attribute not found for person
 * @apiError (403) Forbidden Current user type does not have sufficient privileges.
 * @apiError (404) NotFound Person not found in category <category>
 *
 * @apiSuccess (200) {String} Success Successfully updated person of category <category>
 */
router.put('/:category/:uuid', async (req, res) => {
  const response = await PeopleDb.updatePerson(req.params.category, req.params.uuid, req.body);

  res.status(StatusCode.OK).send(response);
}, authorized(UserType.ADMIN));

export default router;
