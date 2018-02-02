import * as api from '@/routers/transactions/products';
import * as db from '@/database/ProductTransactions';
import logger from '@/utilities/modules/logger';

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
 */
export async function createProdTransactionsInDb(apiReq: api.ProdTransactionReq): Promise<string> {
  const productTypeIdResult = await db.getProductId(apiReq.productType);

  const dbInsertReq: db.prodTransactionDbInsertReq = {
    producttypeid: productTypeIdResult[0].producttypeid,
    datetime: apiReq.datetime,
    topersonuuid: apiReq.toPersonUuid,
    frompersonuuid: apiReq.fromPersonUuid,
    amountofproduct:apiReq.amountOfProduct,
    costperunit: apiReq.costPerUnit,
    currency: apiReq.currency,
    lastmodified: new Date().toISOString(),
  };

  const attributes: db.ProdTransactionAttrDb[] = [];

  if (apiReq.milkQuality) {
    attributes.push({
      attrname: 'milkQuality',
      attrvalue: apiReq.milkQuality,
    });
  }

  return db.insertProdTransaction(dbInsertReq, attributes);
}
