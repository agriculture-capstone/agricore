import dbConnection, { tableNames, execute } from '../../connection';
import logger from '@/utilities/modules/logger';

const peopleCategoriesTable = () => dbConnection()(tableNames.PEOPLE_CATEGORIES);
const peopleCategoryAttributesTable = () => dbConnection()(tableNames.PEOPLE_CATEGORY_ATTRIBUTES);

interface PeopleCategory {
  peoplecategoryid: number;
  peoplecategoryname: string;
}

interface PeopleCategoriesAndAttributes {
  [key: string]: string[];
}

const builders = {
  /** QueryBuilder for getting all people categories */
  getPeopleCategories() {
    return peopleCategoriesTable().select('*');
  },
  /** QueryBuilder for getting a map of all people categories and their attributes */
  getPeopleCategoryAttributes(categoryId: number) {
    return peopleCategoryAttributesTable()
      .join('peopleattributetypes', 'peoplecategoryattributes.attrid', 'peopleattributetypes.attrid')
      .select('attrname')
      .where({
        personCategoryId: categoryId,
      });
  },
};

/* ***************** Exports **********************/

/**
 * Get all people categories and their attributes
 *
 * @returns {Promise<DatabaseUser>}
 */
export async function getAllPeopleCategories() {
  const peopleCategories = await execute<PeopleCategory[]>(builders.getPeopleCategories());
  const result: PeopleCategoriesAndAttributes = {};
  peopleCategories.forEach(function (category: PeopleCategory) {
    const attributes: string[] = [
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
    result[category.peoplecategoryname] = attributes;
  });
  logger.info(result);
  return result;
}
