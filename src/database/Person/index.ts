import dbConnection, { tableNames, execute } from '../connection';

const farmersTable = () => dbConnection()(tableNames.FARMERS);
const personTable = () => dbConnection()(tableNames.FARMERS);


type PersonAttribute
  = 'personUuid' 
  | 'firstName' 
  | 'middleName'
  | 'lastName' 
  | 'phoneNumber'
  | 'phoneCountry'
  | 'phoneArea' 
  | 'companyName';

export type FarmerAttribute = PersonAttribute 
  & 'paymentFrequency' 
  | 'notes';

export async function getFarmers(...attributes: FarmerAttribute[]) {
  if (attributes.length === 0) {
    const request = farmersTable().select('*'); 
    return execute<void>(request);
  } 
}
