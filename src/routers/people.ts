import * as express from 'express';

import createRouter from '@/utilities/functions/createRouter';
import authorized from '@/middleware/authorized';
import { UserType } from '@/models/User/UserType';

import { StatusCode } from '@/models/statusCodes';

const router = createRouter();

/**
 * @api {get} /people/
 * @description Returns all people and all their associated attributes.
 *              The only guaranteed field is a 'personUuid' and 'category'.
 *              Parameters have no effect on this request.
 *              Associated attributes can be checked via /peopleCategories
 * @apiName GetPeople
 *
 * @apiError (401) Unauthorized
 *
 * @apiSuccess (200) {String} Successfully retrieved all people
 * @apiSuccessExample Success-Response:
  [
    {
      "personUuid": "1e167b81-d816-497b-8c0c-36f4d6b2fd33",
      "category": "farmers",
      "firstName": "Zachariah",
      "paymentFrequency": "weekly",
      "notes": "Brother of Moses",
    },
    {
      "personUuid": "4b3f23a3-04c4-468f-bdf5-f189a34d9f69",
      "category": "trader",
      "firstName": "Mary",
      "username": "maryjoseph9",
    }
  ]
 */
router.get('/', async (req, res) => {
  res.status(StatusCode.OK).send('Successfully retrieved all people');
}, authorized(UserType.ADMIN));

/**
 * @api {get} /people/<category>
 * @description Returns all people of this category and all their associated attributes.
 *              Parameters have no effect on this request, but the URL
 *              specifies what kind of people are given.
 *              Associated attributes can be checked via /peopleCategories
 *              In general this API can only be used by admins, with exception
 *              of special user types.
 *              Currently the only exception is that traders can view farmers.
 * @apiName GetPeopleCategory
 *
 * @apiError (401) Unauthorized
 * @apiError (404) Person category not found
 *
 * @apiSuccess (200) {String} Successfully retrieved all people from category <category>
 * @apiSuccessExample /people/farmers Success-Response:
  [
    {
      "personUuid": "1e167b81-d816-497b-8c0c-36f4d6b2fd33",
      "firstName": "Zachariah",
      "paymentFrequency": "weekly",
      "notes": "Brother of Moses",
    },
    {
      "personUuid": "4b3f23a3-04c4-468f-bdf5-f189a34d9f69",
      "firstName": "Zachariah",
      "paymentFrequency": "monthly",
      "notes": "Has a nice car",
    }
  ]
 */
router.get('/:category', async (req, res) => {
  res.status(StatusCode.OK).send('Successfully retrieved all people of category <something>');
}, authorized(UserType.ADMIN));

/**
 * @api {post} /people/<category>
 * @description Creates a new person in the specified category.
 *              Returns the UUID created for that person.
 *              Requires all associated attributes given in /peopleCategories
 * @apiName CreatePerson
 *
 * @apiError (400) Missing or invalid fields, ...
 * @apiError (401) Unauthorized
 *
 * @apiSuccess (201) {String} Successfully created person of category <category>
 * @apiSuccessExample /people/farmers Success-Response:
 * { personUuid: "1e167b81-d816-497b-8c0c-36f4d6b2fd33" }
 */
router.post('/:category', async (req, res) => {
  res.status(StatusCode.CREATED).send('Successfully created new <category>');
}, authorized(UserType.ADMIN));

/**
 * @api {get} /people/<category>/<uuid>
 * @description Gets a particular person
 *              Parameters have no effect on this request.
 * @apiName GetPerson
 *
 * @apiError (401) Unauthorized
 * @apiError (404) Person not found in category <category>
 *
 * @apiSuccess (200) {String} Successfully retrieved person
 * @apiSuccessExample /people/farmers/1e167b81-d816-497b-8c0c-36f4d6b2fd33 Success-Response:
   {
     "personUuid": "1e167b81-d816-497b-8c0c-36f4d6b2fd33",
     "firstName": "Zachariah",
     "paymentFrequency": "weekly",
     "notes": "Brother of Moses",
   }
 */
router.get('/:category/:uuid', async (req, res) => {
  res.status(StatusCode.OK).send('Successfully got <category>');
}, authorized(UserType.ADMIN));

/**
 * @api {put} /people/<category>/<uuid>
 * @description Updates a specific person from a specific category
 *              and all their associated attributes.
 *              Parameters have no effect on this request.
 *              Associated attributes can be checked via /peopleCategories
 * @apiName UpdatePerson
 *
 * @apiParam {String} [<attribute>] An attribute of a person with its value.
 *
 * @apiError (400) Attribute not found for person
 * @apiError (401) Unauthorized
 * @apiError (404) Person not found in category <category>
 *
 * @apiSuccess (200) {String} Successfully updated person of category <category>
 */
router.put('/:category/:uuid', async (req, res) => {
  res.status(StatusCode.OK).send('Successfully updated <category>');
}, authorized(UserType.ADMIN));

export default router;
