import dbConnection, { tableNames, execute } from '../connection';

const farmersTable = () => dbConnection()(tableNames.FARMERS);
// const personTable = () => dbConnection()(tableNames.FARMERS);

/**
 * Attributes for a person
 */
type PersonAttribute
  = 'personUuid' 
  | 'firstName' 
  | 'middleName'
  | 'lastName' 
  | 'phoneNumber'
  | 'phoneCountry'
  | 'phoneArea' 
  | 'companyName'
  ;

/**
 * Attributes for a person
 */
export type FarmerAttribute 
  = PersonAttribute 
  | 'paymentFrequency' 
  | 'notes';

  /**
   * Gets all farmers
   * @param attributes of farmers
   */
export async function getFarmers(...attributes: FarmerAttribute[]) {
  if (attributes.length === 0) {
    const request = farmersTable().select('*'); 
    return execute<void>(request);
  } 
}
