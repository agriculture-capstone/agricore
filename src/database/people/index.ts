import dbConnection, { tableNames, execute } from '../connection';

import * as R from 'ramda';

const peopleTable = () => dbConnection()(tableNames.PEOPLE);
const peopleAttributesTable = () => dbConnection()(tableNames.PEOPLE_ATTRIBUTES);
const peopleCategories = () => dbConnection()(tableNames.PEOPLE_CATEGORIES);
const peopleCategoryAttributes = () => dbConnection()(tableNames.PEOPLE_CATEGORY_ATTRIBUTES);

/**
 * Properties for a person
 */
const PERSON_PROPERTIES = [
  'firstname',
  'middlename', 
  'lastname', 
  'phonenumber',
  'phonearea', 
  'phonecountry',
  'companyname',
];

/**
 * Represents a person in the database
 */
interface PersonDb {
  personuuid: string;
  peoplecategoryid: number;
  peoplecategoryname: string;
  firstname: string;
  middlename: string;
  lastname: string;
  phonenumber: string;
  phonearea: string;
  phonecountry: string;
  companyname: string;
  lastmodified: string;
}

/**
 * Represents a person attribute in the database
 */
interface PeopleAttributeDb {
  personuuid: string;
  attrname: string; 
  attrvalue: string;
}

/**
 * Represents a people attribute type returned by the database
 */
interface PeopleAttributeTypesDb {
  attrname: string;
  attrid: string;
}

/**
 * Represents a person returned in the API
 */
interface Person {
  uuid: string;
  peopleCategory: string;
  firstName: string;
  middleName: string;
  lastName: string;
  phoneNumber: string;
  phoneArea: string;
  phoneCountry: string;
  companyName: string;
  lastModified: string;

  username?: string;
  paymentFrequency?: string;
  notes?: string;
}

const builders = {
  /** Get all people of a certain type */
  getPeople(peoplecategoryname: string) {
    return peopleTable().select('*')
      .join(tableNames.PEOPLE_CATEGORIES,
      tableNames.PEOPLE + '.peoplecategoryid',
      tableNames.PEOPLE_CATEGORIES + '.peoplecategoryid')
      .where({ peoplecategoryname });
  },

  /** Get all attributes and their values for people of a certain type */
  getPeopleAttributeValues(peoplecategoryname: string) {
    return peopleAttributesTable().select('personuuid', 'attrname', 'attrvalue')
      .join(tableNames.PEOPLE_ATTRIBUTE_TYPES,
        tableNames.PEOPLE_ATTRIBUTES + '.attrid',
        tableNames.PEOPLE_ATTRIBUTE_TYPES + '.attrid')
      .join(tableNames.PEOPLE_CATEGORY_ATTRIBUTES,
        tableNames.PEOPLE_ATTRIBUTE_TYPES + '.attrid',
        tableNames.PEOPLE_CATEGORY_ATTRIBUTES + '.attrid')
      .join(tableNames.PEOPLE_CATEGORIES,
        tableNames.PEOPLE_CATEGORIES + '.peoplecategoryid',
        tableNames.PEOPLE_CATEGORY_ATTRIBUTES + '.peoplecategoryid')
      .where({ peoplecategoryname });
  },

  /**
   * Gets the people category ID given the people category name
   * @param name of the people category
   */
  getCategoryId(categoryName: string) {
    return peopleCategories().select('peoplecategoryid')
      .where('peoplecategoryname', categoryName);
  },

  /**
   * Gets the people category attributes given the people category name
   * @param categoryName of the people category
   */
  getPeopleCategoryAttributes(categoryName: string) {
    return peopleCategoryAttributes().select('*')
      .join(tableNames.PEOPLE_ATTRIBUTE_TYPES,
        tableNames.PEOPLE_ATTRIBUTE_TYPES + '.attrid', 
        tableNames.PEOPLE_CATEGORY_ATTRIBUTES + '.attrid')
      .join(tableNames.PEOPLE_CATEGORIES,
        tableNames.PEOPLE_CATEGORIES + '.peoplecategoryid', 
        tableNames.PEOPLE_CATEGORY_ATTRIBUTES + '.peoplecategoryid')
      .where('peoplecategoryname', categoryName);
  },

  /**
   * Inserts a person into the people table and returns the generated uuid
   * @param params the attributes for the person to insert
   * @returns the uuid of the new person created
   */
  insertPerson(params: PersonDb) {
    return peopleTable()
      .insert(params)
      .returning('personuuid');
  },

  /**
   * Inserts a people attribute
   * @param personuuid id of the person
   * @param attrvalue value for the attribute for the person
   * @param attrid id for the attribute to add a value for
   */
  insertAttibuteValue(personuuid: string, attrvalue: string, attrid: number) {
    return peopleAttributesTable()
      .insert({ personuuid, attrid, attrvalue });
  },
};

/** Get all people of a certain category */
export async function getPeople(personCategory: string): Promise<Person[]> {
  const people = await execute<PersonDb[]>(builders.getPeople(personCategory));
  const attrValues = await execute<PeopleAttributeDb[]>(builders.getPeopleAttributeValues(personCategory));
  const results: Person[] = [];

  people.forEach(function (item) {
    const isMatchingUuid = R.propEq('personuuid', item.personuuid);

    const isNotesAttr = R.propEq('attrname', 'notes');
    const notesAttr = R.find(R.allPass([isMatchingUuid, isNotesAttr]))(attrValues);

    const isPaymentFrequencyAttr = R.propEq('attrname', 'paymentFrequency');
    const paymentFrequencyAttr = R.find(R.allPass([isMatchingUuid, isPaymentFrequencyAttr]))(attrValues);

    const isUsernameAttr = R.propEq('attrname', 'username');
    const usernameAttr = R.find(R.allPass([isMatchingUuid, isUsernameAttr]))(attrValues);

    const person: Person = {
      uuid: item.personuuid,
      peopleCategory: item.peoplecategoryname,
      firstName: item.firstname,
      middleName: item.middlename,
      lastName: item.lastname,
      phoneNumber: item.phonenumber,
      phoneArea: item.phonearea,
      phoneCountry: item.phonecountry,
      companyName: item.companyname,
      lastModified: item.lastmodified,
    };

    if (notesAttr !== undefined) {
      person.notes = notesAttr.attrvalue;
    }
    if (paymentFrequencyAttr !== undefined) {
      person.paymentFrequency = paymentFrequencyAttr.attrvalue;
    }
    if (usernameAttr !== undefined) {
      person.username = usernameAttr.attrvalue;
    }

    results.push(person);
  });
  return results;
}

function generateParamsLower(originalObject: any, list1: string[], list2: string[]) {
  const obj1 = {} as any;
  const obj2 = {} as any;

  let key: string = '';
  const keys = Object.keys(originalObject);
  let n = keys.length;

  while (n--) {
    key = keys[n];
    if (list1.indexOf(key) >= 0) {
      obj1[key.toLowerCase()] = originalObject[key];
    } else if (list2.indexOf(key) >= 0) {
      obj2[key.toLowerCase()] = originalObject[key];
    }
  }
  return {
    obj1,
    obj2,
  };
}

export async function insertPerson(peopleCategoryName: string, params: any): Promise<any> {
  const categoryId = (await execute<any>(builders.getCategoryId(peopleCategoryName)))[0].peoplecategoryid;
  if (categoryId < 0) {
    throw new Error('Invalid category');
  }

  const dynamicAttributesDb: PeopleAttributeTypesDb[] = 
    await execute<PeopleAttributeTypesDb[]>(builders.getPeopleCategoryAttributes(peopleCategoryName));
  const attributes = dynamicAttributesDb.map((attribute) => { return attribute.attrname.toLowerCase(); });

  // Convert keys to lower case keys 
  const { obj1: personParamsLower, obj2: dynamicParametersLower } = generateParamsLower(params, PERSON_PROPERTIES, attributes) as any;

  // Validate that person properties are present  
  const validPersonProperties = R.all(propName => R.has(propName, personParamsLower), PERSON_PROPERTIES);

  // Validate that all attribute names for the type are present 
  const validPersonCategoryProperties = R.all(propName => R.has(propName, dynamicParametersLower), attributes);
  if (!validPersonCategoryProperties || !validPersonProperties) {
    throw new Error('Missing propertites'); 
  }

  // Prep the insert params 
  personParamsLower.lastmodified = new Date().toISOString();
  personParamsLower.peoplecategoryid = categoryId;

  // Insert into person table
  const insertPerson = await execute<PersonDb>(builders.insertPerson(personParamsLower)) as any;
  const personUuid = insertPerson[0];
  // // Insert into people attributes
  for (const k of Object.keys(dynamicParametersLower)) {
    //  get the attrid from dynamicAttributesDb
    let attrid: any;
    for (const attr of dynamicAttributesDb) {
      if (k === attr.attrname.toLowerCase()) {
        attrid = attr.attrid;
        break;
      }
    }
    await execute<PersonDb>(builders.insertAttibuteValue(personUuid, dynamicParametersLower[k], attrid));
  }
  return personUuid;
}
