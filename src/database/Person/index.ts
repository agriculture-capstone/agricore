import dbConnection, { tableNames, execute } from '../connection';
import { UserType } from '@/models/User/UserType';

const peopleAttributesTable = () => dbConnection()(tableNames.PEOPLE_ATTRIBUTES);
const peopleCategoriesTable = () => dbConnection()(tableNames.PEOPLE_CATEGORIES);

/**
 *
 * Represents a Person who can log in and out, meaning has a username and password
 *
 */
export interface User {
  uuid: string;
  username: string;
  userType: UserType;
  hash: string;
}

interface AttrValue {
  attrvalue: string;
}

interface PersonUuid {
  personuuid: string;
}

interface PersonCategoryName {
  [key:string]: any;
  peoplecategoryname: string;
}

const builders = {
  /** Get a people's atribute from their UUID */
  getAttr(personuuid: string, attrname: string) {
    return peopleAttributesTable().select('attrvalue')
    .join('peopleattributetypes', 'peopleattributetypes.attrid', 'peopleattributes.attrid')
    .where({ attrname, personuuid });
  },

  /** Get a user's UUID from their username */
  findUserUuid(username: string) {
    const attrname = 'username';
    const attrvalue = username;
    return peopleAttributesTable().select('personuuid')
    .join('peopleattributetypes', 'peopleattributetypes.attrid', 'peopleattributes.attrid')
    .where({ attrname, attrvalue });
  },

  /** Get a people's PeoplCategory from their Uuid */
  getPersonCategory(personuuid: string) {
    return peopleCategoriesTable().select('peoplecategoryname')
    .join('people', 'people.peoplecategoryid', 'peoplecategories.peoplecategoryid')
    .where({ personuuid });
  },
};

/** Build a UserType object from a string */
function buildUserType(type: string): UserType {
  switch (type) {
    case UserType.ADMIN: {
      return UserType.ADMIN;
    }
    case UserType.MONITOR: {
      return UserType.MONITOR;
    }
    case UserType.TRADER: {
      return UserType.TRADER;
    }
    default: {
      throw new Error('Unrecognized user type, ' + type);
    }
  }
}

/** Get attributes for a user necessary for a login from a username */
export async function findUser(username: string): Promise<User> {
  const uuidResults = await execute<PersonUuid[]>(builders.findUserUuid(username));
  if (uuidResults.length === 0) {
    throw new Error('Username ' + username + ' not found');
  }
  const uuid = uuidResults[0].personuuid;

  const hashResults = await execute<AttrValue[]>(builders.getAttr(uuid, 'hash'));
  if (hashResults.length === 0) {
    throw new Error(username + ' has no password set!');
  }

  const userTypeResults = await execute<PersonCategoryName[]>(builders.getPersonCategory(uuid));
  if (userTypeResults.length === 0) {
    throw new Error(username + '  has no category set!');
  }

  return {
    uuid,
    username,
    userType: buildUserType(userTypeResults[0].peoplecategoryname),
    hash: hashResults[0].attrvalue,
  };
}
