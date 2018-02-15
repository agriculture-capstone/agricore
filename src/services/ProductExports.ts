import * as api from '@/routers/productExports';
import * as db from '@/database/ProductExports';
import * as productTransactionsDb from '@/database/ProductTransactions';
import logger from '@/utilities/modules/logger';

/** message when an unhandled error is thrown */
export const unhandledErrorMsg = 'unhandled error';

/**
 * Connector for the API and database to get all product exports
 */
export async function getProdExportsFromDb(): Promise<api.ProdExport[]> {
  const dbProdExports: db.ProdExportDb[] = await db.getProdExports();
  const results: api.ProdExport[] = [];

  logger.info('results', results);

  dbProdExports.forEach(function (item: db.ProdExportDb) {
    const newExport: api.ProdExport = {
      uuid: item.productexportuuid,
      transportId: item.transportid,
      datetime: item.datetime,
      productType: item.productname,
      amountOfProduct: item.amountofproduct,
      lastModified: item.lastmodified
    };

    results.push(newExport);
  });

  return results;
}

/**
 * Connector for the API and database to create a new product export
 * Throws error on invalid request
 * Throws error with message "unhandled error" for unhandled errors
 */
export async function createProdExportInDb(apiReq: api.ProdExportReq): Promise<string> {
  let productTypeId: number = -1;
  const invalidFields: string[] = [];

  // validate request
  try {
    productTypeId = await productTransactionsDb.getProductId(apiReq.productType);
  } catch (e) {
    throw new Error('Product type ' + apiReq.productType + ' not supported');
  }

  if (!apiReq.uuid) {
    invalidFields.push('uuid');
  }
  if (!apiReq.transportId) {
    invalidFields.push('transportId');
  }
  if (!apiReq.datetime) {
    invalidFields.push('datetime');
  }
  if (!apiReq.productType) {
    invalidFields.push('productType');
  }
  if (!apiReq.amountOfProduct) {
    invalidFields.push('amountOfProduct');
  }

  // create database request
  const dbInsertReq: db.ProdExportDbInsertReq = {
    productexportuuid: apiReq.uuid,
    producttypeid: productTypeId,
    amountofproduct: apiReq.amountOfProduct,
    transportid: apiReq.transportId,
    datetime: apiReq.datetime,
    lastmodified: new Date().toISOString(),
  };

  // throw error for any invalid fields
  if (invalidFields.length !== 0) {
    let errorMsg = 'The following fields are invalid or missing';
    invalidFields.forEach(function (invalidField) {
      errorMsg += ', ' + invalidField;
    });
    throw new Error(errorMsg);
  }

  let newUuid: string;
  try {
    newUuid = await db.insertProdExport(dbInsertReq);
  } catch (e) {
    throw new Error(unhandledErrorMsg);
  }
  return newUuid;
}
