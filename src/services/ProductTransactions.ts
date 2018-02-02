import * as api from '@/routers/transactions/products';
import * as db from '@/database/ProductTransactions';
import logger from '@/utilities/modules/logger';

export async function getProdTransactionsFromDb(productType: string): Promise<api.ProdTransaction[]> {
  const dbProdTransactions: db.ProdTransactionDb[] = await db.getProdTransactions(productType);
  const results: api.ProdTransaction[] = [];

  logger.info('results', results)

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
