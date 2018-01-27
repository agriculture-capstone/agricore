import dbConnection, { tableNames, execute } from '../connection';
import logger from '@/utilities/modules/logger';

const peopleCategoriesTable = () => dbConnection()('peoplecategories');
const productTypesAttributesTable = () => dbConnection()(tableNames.PRODUCT_ATTRIBUTE_TYPES);

export interface PeopleCategoryDb {
  peoplecategoryid: number;
  peoplecategoryname: string;
}

export interface PeopleCategoriesAttributesDb {
  peoplecategoryid: number;
  attrid: string;
  attrname: string;
}

export interface PeopleCategory {
  name: string;
  attributes: PeopleAttributes[];
}

/**
 * Type for people attributes
 */
type PeopleAttributes = string;


/**
 * Query builder
 */
const builders = {
  getPeopleOfCategory(category: string) {
    return peopleCategoriesTable()
    .select('*')
    .join('people', 'people.peoplecategoryid', '=', 'peoplecategories.peoplecategoryid')
    .where({ peoplecategoryname: category.toLowerCase() })
    // ;
    .join('peoplecategoryattributes', 'peoplecategoryattributes.peoplecategoryid', '=', 'peoplecategories.peoplecategoryid')
    .join('peopleattributes', 'peopleattributes.attrid', '=', 'peoplecategoryattributes.attrid')
    ;
    // get all of their attributes
    // get all of their associated attributes (peoplecategoryattributes and people attribute types)
  },
  getPeopleAttributesOfCategory(category: string) {
    return peopleCategoriesTable()
    .select('*')
    .join('peoplecategoryattributes', 'peoplecategoryattributes.peoplecategoryid', '=', 'peoplecategories.peoplecategoryid')
    .join('peopleattributes', 'peopleattributes.attrid', '=', 'peoplecategoryattributes.attrid')
    .join('peopleattributetypes', 'peopleattributetypes.attrid', '=', 'peopleattributes.attrid')
    .join('people', 'people.personuuid', '=', 'peopleattributes.personuuid')
    .where({ peoplecategoryname: category.toLowerCase() })
    ;
  },
};

function formatResponse(people: any[]) {
  // generate key values for the dynamic attributes
  const dynamicAttr = people
    .map((person) => { });
  return people.map((person) => {

  });
}
/**
 * Gets all the people in a certain category.
 * @param category The people to retrieve from this category
 */
export async function getPeopleOfCategory(category: string) {
  const peopleOfCategory = await execute<any>(builders.getPeopleAttributesOfCategory(category));
  const response = formatResponse(peopleOfCategory);
  logger.info(response);
  return response;
}
