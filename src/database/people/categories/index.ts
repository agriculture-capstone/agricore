import dbConnection, { tableNames, execute } from '../../connection';
import logger from '@/utilities/modules/logger';

const personCategoriesTable = () => dbConnection()(tableNames.PERSON_CATEGORIES);
const personCategoryAttributesTable = () => dbConnection()(tableNames.PERSON_CATEGORY_ATTRIBUTES);

interface PersonCategory {
  personcategoryid: number;
  personcategoryname: string;
}

interface PersonCategoriesAndAttributes {
  [key: string]: string[];
}

const builders = {
  /** QueryBuilder for getting all person categories */
  personCategories() {
    return personCategoriesTable().select('*');
  },
  /** QueryBuilder for getting a map of all person categories and their attributes */
  personCategoryAttributes(categoryId: number) {
    return personCategoryAttributesTable()
      .join('personattributetypes', 'personcategoryattributes.attrid', 'personattributetypes.attrid')
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
  const personCategories = await execute<PersonCategory[]>(builders.personCategories());
  const result: PersonCategoriesAndAttributes = {};
  personCategories.forEach(function (category: PersonCategory) {
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
    result[category.personcategoryname] = attributes;
  });
  logger.info(result);
  return result;
}
