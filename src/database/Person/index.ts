import dbConnection, { tableNames, execute } from '../connection';
import logger from '@/utilities/modules/logger';

const personAttributesTable = () => dbConnection()(tableNames.PERSON_ATTRIBUTES);
const personCategoriesTable = () => dbConnection()(tableNames.PERSON_CATEGORIES)

export interface User {
  uuid: string;
  username: string;
  userType: string;
  hash: string;
}

interface AttrValue {
  attrvalue: string;
}

interface PersonUuid {
   personuuid: string;
}

interface PersonCategoryName {
  personcategoryname: string;
}

const builders = {
  getAttr(personuuid: string, attrname: string) {
    return personAttributesTable().select('attrvalue')
      .join('personattributetypes', 'personattributetypes.attrid', 'personattributes.attrid')
      .where({ attrname, personuuid });
  },
  findUserUuid(username: string) {
    const attrname = 'username';
    const attrvalue = username;
    return personAttributesTable().select('personuuid')
      .join('personattributetypes', 'personattributetypes.attrid', 'personattributes.attrid')
      .where({ attrname, attrvalue });
  },
  getPersonCategory(personuuid: string) {
    return personCategoriesTable().select('personcategoryname')
      .join('people', 'people.personcategoryid', 'personcategories.personcategoryid')
      .where({ personuuid });
  }
};

export async function findUser(username: string): User {
  logger.info('Person/index.ts findUser');

  const uuidResults = await execute<PersonUuid[]>(builders.findUserUuid(username));
  if (uuidResults.length === 0) {
    throw new Error('Username ' + username + ' not found')
  }
  const uuid = uuidResults[0].personuuid;
  logger.info('uuid, ', uuid);

  const hashResults = await execute<AttrValue[]>(builders.getAttr(uuid, 'hash'));
  if (hashResults.length === 0) {
    throw new Error(username + ' has no password set!')
  }
  logger.info('hash, ', hashResults[0].attrvalue);

  const userTypeResults = await execute<PersonCategoryName[]>(builders.getPersonCategory(uuid));
  if (userTypeResults.length === 0) {
    throw new Error(username + '  has no category set!')
  }
  logger.info('userType, ', userTypeResults[0].personcategoryname);
  return () =>  ({
    uuid: uuid,
    username: username,
    userType: userTypeResults[0].personcategoryname,
    hash: hashResults[0].attrvalue,
  });
}
