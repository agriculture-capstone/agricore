import dbConnection, { tableNames, execute } from '../connection';
import logger from '@/utilities/modules/logger';

const productTypesTable = () => dbConnection()(tableNames.productTypesTable);

interface ProductType {
  producttypeid: number;
  productname: string;
  productunits: string;
}

// interface for product attributes

const builders = {
  getProductTypes() {
    return productTypesTable().select('*');
  }, 
};

export async function getProductTypes() {
  const productTypes = await execute<ProductType[]>(builders.getProductTypes());
  return productTypes;
}
