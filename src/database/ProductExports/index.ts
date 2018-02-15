import dbConnection, { tableNames, execute } from '../connection';

import * as R from 'ramda';

const prodExportTable = () => dbConnection()(tableNames.PRODUCT_EXPORTS);

/**
 * Represent a product transaction after retrieval from the database
 */
export interface ProdExportDb {
  productexportuuid: string;
  transportid: string;
  datetime: string;
  productname: string;
  producttypeid: string;
  amountofproduct: number;
}

const builders = {

  /** Get all product exports */
  getProdExports() {
    return prodExportTable().select('*')
    .join(tableNames.PRODUCT_TYPES,
      tableNames.PRODUCT_TYPES + '.producttypeid',
      tableNames.PRODUCT_EXPORTS + '.producttypeid');
  },
};

/** Get all product transactions of a certain type */
export async function getProdExports(): Promise<ProdExportDb[]> {
  const transactions = await execute<ProdExportDb[]>(builders.getProdExports());
  return transactions;
}
