import * as api from '@/routers/transactions/products';
import * as db from '@/database/ProductTransactions';
import logger from '@/utilities/modules/logger';

/** message when an unhandled error is thrown */
export const unhandledErrorMsg = 'unhandled error';

/**
 * Connector for the API and database to get a single product transaction
 */
export async function getProdTransactionFromDb(uuid: string): Promise<api.ProdTransaction> {
  logger.info('getting single transaction', uuid);
  const dbProdTransaction: db.ProdTransactionDb = await db.getProdTransaction(uuid);
  const result: api.ProdTransaction = {
    uuid: dbProdTransaction.producttransactionuuid,
    productType: dbProdTransaction.productname,
    productUnits: dbProdTransaction.productunits,
    datetime: dbProdTransaction.datetime,
    toPersonUuid: dbProdTransaction.topersonuuid,
    fromPersonUuid: dbProdTransaction.frompersonuuid,
    amountOfProduct: dbProdTransaction.amountofproduct,
    costPerUnit: dbProdTransaction.costperunit,
    currency: dbProdTransaction.currency,
    lastModified: dbProdTransaction.lastmodified,
  };

  dbProdTransaction.attributes.forEach(function (attr: db.ProdTransactionAttrDb) {
    if (attr.attrname === 'milkQuality') {
      result.milkQuality = attr.attrvalue;
    }
    // more if statements for other types of attributes
  });

  return result;
}

/**
 * Connector for the API and database to get all product transactions
 */
export async function getProdTransactionsFromDb(productType: string): Promise<api.ProdTransaction[]> {
  const dbProdTransactions: db.ProdTransactionDb[] = await db.getProdTransactions(productType);
  const results: api.ProdTransaction[] = [];

  logger.info('results', results);

  dbProdTransactions.forEach(function (item: db.ProdTransactionDb) {
    const newTransaction: api.ProdTransaction = {
      uuid: item.producttransactionuuid,
      productType: item.productname,
      productUnits: item.productunits,
      datetime: item.datetime,
      toPersonUuid: item.topersonuuid,
      fromPersonUuid: item.frompersonuuid,
      amountOfProduct: item.amountofproduct,
      costPerUnit: item.costperunit,
      currency: item.currency,
      lastModified: item.lastmodified,
    };

    item.attributes.forEach(function (attr: db.ProdTransactionAttrDb) {
      if (attr.attrname === 'milkQuality') {
        newTransaction.milkQuality = attr.attrvalue;
      }
      // more if statements for other types of attributes
    });

    results.push(newTransaction);
  });

  return results;
}

/**
 * Connector for the API and database to create a new product transaction
 * Throws error on invalid request
 * Throws error with message "unhandled error" for unhandled errors
 */
export async function createProdTransactionsInDb(apiReq: api.ProdTransactionReq): Promise<string> {
  let productTypeId: number = -1;
  const invalidFields: string[] = [];

  // validate request
  try {
    productTypeId = await db.getProductId(apiReq.productType);
  } catch (e) {
    throw new Error('Product type ' + apiReq.productType + ' not supported');
  }

  if (!apiReq.uuid) {
    invalidFields.push('uuid');
  }
  if (!apiReq.datetime) {
    invalidFields.push('datetime');
  }
  if (!apiReq.toPersonUuid) {
    invalidFields.push('toPersonUuid');
  }
  if (!apiReq.fromPersonUuid) {
    invalidFields.push('fromPersonUuid');
  }
  if (!apiReq.amountOfProduct) {
    invalidFields.push('amountOfProduct');
  }
  if (!apiReq.costPerUnit) {
    invalidFields.push('costPerUnit');
  }
  if (!apiReq.currency) {
    invalidFields.push('currency');
  }

  // create database request
  const dbInsertReq: db.prodTransactionDbInsertReq = {
    producttypeid: productTypeId,
    producttransactionuuid: apiReq.uuid,
    datetime: apiReq.datetime,
    topersonuuid: apiReq.toPersonUuid,
    frompersonuuid: apiReq.fromPersonUuid,
    amountofproduct:apiReq.amountOfProduct,
    costperunit: apiReq.costPerUnit,
    currency: apiReq.currency,
    lastmodified: new Date().toISOString(),
  };

  // create database request for attribute entry
  const attributes: db.ProdTransactionAttrDb[] = [];

  if (apiReq.productType === 'milk') {
    if (!apiReq.milkQuality) {
      invalidFields.push('milkQuality');
    } else {
      attributes.push({
        attrname: 'milkQuality',
        attrvalue: apiReq.milkQuality,
      });
    }
  }

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
    newUuid = await db.insertProdTransaction(dbInsertReq, attributes);
  } catch (e) {
    throw new Error(unhandledErrorMsg);
  }
  return newUuid;
}

/**
 * Connector for the API and database to update a product transaction
 * Throws error with message "unhandled error" for unhandled errors
 */
export async function updateProdTransactionInDb(apiReq: api.ProdTransactionUpdateReq) {
  let productTypeId: number = -1;
  // validate request
  try {
    productTypeId = await db.getProductId(apiReq.productType);
  } catch (e) {
    throw new Error('Product type ' + apiReq.productType + ' not supported');
  }

  try {
    if (apiReq.datetime) {
      await db.updateProdTransactionField(apiReq.uuid, 'datetime', apiReq.datetime);
    }
    if (apiReq.toPersonUuid) {
      await db.updateProdTransactionField(apiReq.uuid, 'topersonuuid', apiReq.toPersonUuid);
    }
    if (apiReq.fromPersonUuid) {
      await db.updateProdTransactionField(apiReq.uuid, 'frompersonuuid', apiReq.fromPersonUuid);
    }
    if (apiReq.amountOfProduct) {
      await db.updateProdTransactionField(apiReq.uuid, 'amountofproduct', apiReq.amountOfProduct);
    }
    if (apiReq.costPerUnit) {
      await db.updateProdTransactionField(apiReq.uuid, 'costperunit', apiReq.costPerUnit);
    }
    if (apiReq.currency) {
      await db.updateProdTransactionField(apiReq.uuid, 'currency', apiReq.currency);
    }

    if (apiReq.milkQuality) {
      await db.updateProdTransactionAttr(apiReq.uuid, 'milkQuaity', apiReq.milkQuality);
    }
  } catch (e) {
    throw new Error(unhandledErrorMsg);
  }
  await db.updateProdTransactionField(apiReq.uuid, 'lastmodified', new Date().toISOString());
  return;
}
