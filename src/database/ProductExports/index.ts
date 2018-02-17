import dbConnection, { tableNames, execute } from '../connection';

const prodExportTable = () => dbConnection()(tableNames.PRODUCT_EXPORTS);

/**
 * Represent a product export after retrieval from the database
 */
export interface ProdExportDb {
  productexportuuid: string;
  recorderuuid: string;
  transportid: string;
  datetime: string;
  productname: string;
  producttypeid: number;
  amountofproduct: number;
  productunits: string;
  lastmodified: string;
}

/**
 * Represent a product export used in an INSERT call on the database
 */
export interface ProdExportDbInsertReq {
  productexportuuid: string;
  recorderuuid: string;
  transportid: string;
  datetime: string;
  producttypeid: number;
  amountofproduct: number;
  lastmodified: string;
}

const builders = {
  /** Get a single product export */
  getSingleProdExport(productexportuuid: string) {
    return prodExportTable().select('*')
    .join(tableNames.PRODUCT_TYPES,
      tableNames.PRODUCT_TYPES + '.producttypeid',
      tableNames.PRODUCT_EXPORTS + '.producttypeid')
    .where({ productexportuuid });
  },

  /** Get all product exports */
  getProdExports() {
    return prodExportTable().select('*')
    .join(tableNames.PRODUCT_TYPES,
      tableNames.PRODUCT_TYPES + '.producttypeid',
      tableNames.PRODUCT_EXPORTS + '.producttypeid');
  },

  /** Inserts a new product export row in the database */
  insertProdExport(prodExport: ProdExportDbInsertReq) {
    return prodExportTable()
    .returning('productexportuuid')
    .insert(prodExport);
  },

  /** updates a single product export field in the database */
  updateProdExportField(productexportuuid: string, field: string, value: any) {
    return prodExportTable()
      .update(field, value)
      .where({ productexportuuid });
  },
};

/** Get a single product export */
export async function getProdExport(uuid: string): Promise<ProdExportDb> {
  const transactions = await execute<ProdExportDb[]>(builders.getSingleProdExport(uuid));
  const transaction = transactions[0];
  return transaction;
}


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

/** Update a single column for a single product export */
export async function updateProdExportField(uuid: string, field: string, value: string|number) {
  return await execute<any>(builders.updateProdExportField(uuid, field, value));
}
