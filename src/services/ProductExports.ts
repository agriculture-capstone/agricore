import * as api from '@/routers/productExports';
import * as db from '@/database/ProductExports';
import * as productTransactionsDb from '@/database/ProductTransactions';
import logger from '@/utilities/modules/logger';

/** message when an unhandled error is thrown */
export const unhandledErrorMsg = 'unhandled error';

/**
 * Connector for the API and database to get a single product export
 */
export async function getProdExportFromDb(uuid: string): Promise<api.ProdExport> {
  const dbProdExport: db.ProdExportDb = await db.getProdExport(uuid);
  const result: api.ProdExport = {
    uuid: dbProdExport.productexportuuid,
    recorderUuid: dbProdExport.recorderuuid,
    transportId: dbProdExport.transportid,
    datetime: dbProdExport.datetime,
    productType: dbProdExport.productname,
    amountOfProduct: dbProdExport.amountofproduct,
    productUnits: dbProdExport.productunits,
    lastModified: dbProdExport.lastmodified,
  };

  return result;
}


/**
 * Connector for the API and database to get all product exports
 */
export async function getProdExportsFromDb(): Promise<api.ProdExport[]> {
  const dbProdExports: db.ProdExportDb[] = await db.getProdExports();
  const results: api.ProdExport[] = [];

  dbProdExports.forEach(function (item: db.ProdExportDb) {
    const newExport: api.ProdExport = {
      uuid: item.productexportuuid,
      recorderUuid: item.recorderuuid,
      transportId: item.transportid,
      datetime: item.datetime,
      productType: item.productname,
      amountOfProduct: item.amountofproduct,
      productUnits: item.productunits,
      lastModified: item.lastmodified,
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
export async function createProdExportInDb(apiReq: api.ProdExportCreationReq): Promise<string> {
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
  if (!apiReq.recorderUuid) {
    invalidFields.push('recorderUuid');
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

  // throw error for any invalid fields
  if (invalidFields.length !== 0) {
    let errorMsg = 'The following fields are invalid or missing';
    invalidFields.forEach(function (invalidField) {
      errorMsg += ', ' + invalidField;
    });
    throw new Error(errorMsg);
  }

  // create database request
  const dbInsertReq: db.ProdExportDbInsertReq = {
    productexportuuid: apiReq.uuid,
    recorderuuid: apiReq.recorderUuid,
    producttypeid: productTypeId,
    amountofproduct: apiReq.amountOfProduct,
    transportid: apiReq.transportId,
    datetime: apiReq.datetime,
    lastmodified: new Date().toISOString(),
  };


  let newUuid: string;
  try {
    newUuid = await db.insertProdExport(dbInsertReq);
  } catch (e) {
    throw new Error(unhandledErrorMsg);
  }
  return newUuid;
}

/**
 * Connector for the API and database to update a product export
 * Throws error with message "unhandled error" for unhandled errors
 */
export async function updateProdExportInDb(apiReq: api.ProdExportUpdateReq) {
  try {
    if (apiReq.transportId) {
      await db.updateProdExportField(apiReq.uuid, 'transportid', apiReq.transportId);
    }
    if (apiReq.amountOfProduct) {
      await db.updateProdExportField(apiReq.uuid, 'amountofproduct', apiReq.amountOfProduct);
    }
  } catch (e) {
    throw new Error(unhandledErrorMsg);
  }

  await db.updateProdExportField(apiReq.uuid, 'lastmodified', new Date().toISOString());
  return;
}
