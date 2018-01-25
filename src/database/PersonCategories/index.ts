import dbConnection, { tableNames, execute } from '../connection';

const personCategoriesTable = () => dbConnection()(tableNames.PERSON_CATEGORIES);
const personCategoryAttributesTable = () => dbConnection()(tableNames.PERSON_CATEGORY_ATTRIBUTES);

interface PersonCategory {
  id: number;
  name: string;
}

interface PersonCategoriesAndAttributes {
  [key: string]: string[];
}

const builders = {
  /** QueryBuilder for getting all person categories */
  personCategories() {
    return personCategoriesTable().select('*');
  },
  personCategoryAttributes(categoryId: number) {
  	return personCategoryAttributesTable()
  		.join('PersonAttributeTypes', 'PersonCategoryAttributes.attrId', 'PersonAttributeTypes.attrId')
  		.select('attrName')
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
  let result: PersonCategoriesAndAttributes;
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
  	result[category.name] = attributes;
  });


  return personCategories;
}