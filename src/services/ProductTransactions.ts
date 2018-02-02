import * as api from '@/routers/transactions/products';
import * as db from '@/database/ProductTransactions';
import logger from '@/utilities/modules/logger';

/** message when an unhandled error is thrown */
export const unhandledErrorMsg = 'unhandled error';

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
 * Throws eror with message "unhandled error" for unhandled errors
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
