import dbConnection, { tableNames, execute } from '../connection';

import * as R from 'ramda';

const prodExportTable = () => dbConnection()(tableNames.PRODUCT_EXPORTS);

/**
 * Represent a product export after retrieval from the database
 */
export interface ProdExportDb {
  productexportuuid: string;
  transportid: string;
  datetime: string;
  productname: string;
  producttypeid: number;
  amountofproduct: number;
  lastmodified: string;
}

/**
 * Represent a product export used in an INSERT call on the database
 */
export interface ProdExportDbInsertReq {
  productexportuuid: string;
  transportid: string;
  datetime: string;
  producttypeid: number;
  amountofproduct: number;
  lastmodified: string;
}

const builders = {

  /** Get all product exports */
  getProdExports() {
    return prodExportTable().select('*')
    .join(tableNames.PRODUCT_TYPES,
      tableNames.PRODUCT_TYPES + '.producttypeid',
      tableNames.PRODUCT_EXPORTS + '.producttypeid');
  },

  insertProdExport(prodExport: ProdExportDbInsertReq) {
    return prodExportTable()
    .returning('productexportuuid')
    .insert(prodExport);
  },
};

/** Get all product exports of a certain type */
export async function getProdExports(): Promise<ProdExportDb[]> {
  const exports = await execute<ProdExportDb[]>(builders.getProdExports());
  return exports;
}

/** creates a new product export in the database, returns the new UUID */
export async function insertProdExport(req: ProdExportDbInsertReq): Promise<string> {
  const newUuid = await execute<any>(builders.insertProdExport(req));
  return newUuid[0];
}
