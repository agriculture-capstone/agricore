import dbConnection, { tableNames, execute } from '../connection';

const personTable = () => dbConnection()(tableNames.PEOPLE);
const personAttributesTable = () => dbConnection()(tableNames.PERSON_ATTRIBUTES);
const personAttributeTypesTable = () => dbConnection()(tableNames.PERSON_ATTRIBUTE_TYPES);

export interface User {
  uuid: string;
  username: string;
  userType: string;
  hash: string;
}

const builders = {
  getAttrId(attribute: string) {
    return personAttributeTypesTable().select('attrid').where({
      attribute
    });
  },
  findUser(username: string) {
    const attrvalue = username;
    const attrid = await execute<number>(builders.getAttrId('username'));
    return personAttributesTable().select('personUuid').where({
      attrvalue, attrid
    });
  },
}

export async function findUser(username: string) {
  const uuid = await execute<string>(builders.findUser(username));
  return execute<void>(request);
}
