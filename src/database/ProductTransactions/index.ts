import dbConnection, { tableNames, execute } from '../connection';
import logger from '@/utilities/modules/logger';
import * as ProductTypesDb from '@/database/products';

const productTransactionsTable = () => dbConnection()(tableNames.PRODUCT_TRANSACTIONS);
const productTransactionsAttributesTable = () => dbConnection()(tableNames.PRODUCT_TRANSACTION_ATTRIBUTES);

/**
 * Represents a product transaction, except for it's typeid
 */
interface ProductTransactionDb {
  producttransactionuuid: string
  productunits: string
  datetime: string
  topersonuuid: string
  frompersonuuid: string
  amountofproduct: number
  costperunit: number
  currency: string
  lastmodified: string
}

interface ProductTransactionAttribute {
  producttransactionuuid: string
  attrName: string
  attrValue: string
}

const builders = {
  /** Get all product transactions of a certain type */
  getProductTransactions(productname: string) {
    return productTransactionsTable().select('*')
    .join(tableNames.PRODUCT_TYPES,
      tableNames.PRODUCT_TYPES + '.producttypeid',
      tableNames.PRODUCT_TRANSACTIONS + '.producttypeid')
    .where({ productname });
  },

 /* get all attributes and vlues for a certain type */
  getProductTransactionsAttributeValues(productname: string) {
    return productTransactionsAttributesTable().select('producttransactionuuid', 'attrname', 'attrvalue')
    .join(tableNames.PRODUCT_TYPE_TRANSACTION_ATTRIBUTES,
        tableNames.PRODUCT_TYPE_TRANSACTION_ATTRIBUTES + '.attrid',
        tableNames.PRODUCT_TRANSACTION_ATTRIBUTES + '.attrid')
    .join(tableNames.PRODUCT_TYPES,
        tableNames.PRODUCT_TYPE_TRANSACTION_ATTRIBUTES + '.producttypeid',
        tableNames.PRODUCT_TYPES + '.producttypeid')
    .where({ productname });
  }
};

/** Get all product transactions of a certain type */
export async function getProductTransactions(productType: string): Promise<Map<string, string|number>[]> {
  const transactions = await execute<ProductTransactionDb[]>(builders.getProductTransactions(productType));
  logger.info('resultNoAttr', transactions);
  const resultsNoAttr: Map<string, string|number>[] = [];
  transactions.forEach(function(transaction) {
    const jsonTransaction = new Map<string, string|number> ();
    jsonTransaction.set('productTransactionUuid', transaction.producttransactionuuid);
    jsonTransaction.get('productTransactionUuid');
    logger.info('jsonTransaction.keys()', jsonTransaction.keys());
    jsonTransaction.set('productUnits', transaction.productunits);
    jsonTransaction.set('datetime', transaction.datetime);
    jsonTransaction.set('toPersonUuid', transaction.topersonuuid);
    jsonTransaction.set('fromPersonUuid', transaction.frompersonuuid);
    jsonTransaction.set('amountOfProduct', transaction.amountofproduct);
    jsonTransaction.set('costPerUnit', transaction.costperunit);
    jsonTransaction.set('currency', transaction.currency);
    jsonTransaction.set('lastModified', transaction.lastmodified);
    resultsNoAttr.push(jsonTransaction)
  });
  logger.info('resultsNoAttr', resultsNoAttr);

  const attrValues = await execute<ProductTransactionAttribute[]>(builders.getProductTransactionsAttributeValues(productType));
  const result = resultsNoAttr.map(function(item){
      let newItem : Map<string, string|number> = item;
      attrValues.forEach(function(value) {
        if(item.get('producttransactionuuid') === value.producttransactionuuid) {
          newItem.set(value.attrName, value.attrValue);
        }
      })
      return newItem
  });
  logger.info("result is ", result);
  return
}
