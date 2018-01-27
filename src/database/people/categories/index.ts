import dbConnection, { tableNames, execute } from '../../connection';
import logger from '@/utilities/modules/logger';

const peopleCategoriesTable = () => dbConnection()(tableNames.PEOPLE_CATEGORIES);
const peopleCategoryAttributesTable = () => dbConnection()(tableNames.PEOPLE_CATEGORY_ATTRIBUTES);

interface PeopleCategoryDb {
  peoplecategoryid: number;
  peoplecategoryname: string;
}

interface PeopleCategoriesAttributesDb {
  peoplecategoryid: number;
  attrid: string;
  attrname: string;
}

interface PeopleCategory {
  name: string;
  attributes: PeopleAttributes[];
}

/**
 * Type for people attributes
 */
type PeopleAttributes = string;

const builders = {
  /** QueryBuilder for getting all people categories */
  getPeopleCategories() {
    return peopleCategoriesTable().select('*');
  },
  /** QueryBuilder for getting a map of all people categories and their attributes */
  getPeopleCategoryAttributes() {
    return peopleCategoryAttributesTable()
    .select('*')
    .join('peopleattributetypes', 'peoplecategoryattributes.attrid', 'peopleattributetypes.attrid');
  },
};

/* ***************** Exports **********************/

const PEOPLE_ATTRIBUTES: string[] = [
  'personUuid',
  'firstName',
  'middleName',
  'lastName',
  'phoneNumber',
  'phoneArea',
  'phoneCountry',
  'companyName',
  'lastModified',
];

function formatPeopleCategories(categories: PeopleCategoryDb[], attributes: PeopleCategoriesAttributesDb[]): PeopleCategory[] {
  return categories.map((category) => {
    const relatedAttributes = attributes
      .filter((attribute) => {
        return category.peoplecategoryid === attribute.peoplecategoryid && attribute.attrname !== 'hash';
      })
      .map((attribute) => {
        return attribute.attrname;
      });

    return {
      name: category.peoplecategoryname,
      attributes: PEOPLE_ATTRIBUTES.concat(relatedAttributes),
    };
  });
}

/**
 * Get all people categories and their attributes
 *
 * @returns {Promise<DatabaseUser>}
 */
export async function getAllPeopleCategories() {
  const peopleCategories = await execute<PeopleCategoryDb[]>(builders.getPeopleCategories());
  const categoryAttributes = await execute<PeopleCategoriesAttributesDb[]>(builders.getPeopleCategoryAttributes());
  const result = formatPeopleCategories(peopleCategories, categoryAttributes); 
  logger.info(result);
  return result;
}
