import dbConnection, { tableNames, execute } from '../connection';
import logger from '@/utilities/modules/logger';

import * as R from 'ramda';

const productTypesTable = () => dbConnection()(tableNames.PRODUCT_TYPES);
const productTransactionsTable = () => dbConnection()(tableNames.PRODUCT_TRANSACTIONS);
const productTransactionsAttributesTable = () => dbConnection()(tableNames.PRODUCT_TRANSACTION_ATTRIBUTES);
const productTypeTransactionAttributesTable = () => dbConnection()(tableNames.PRODUCT_TYPE_TRANSACTION_ATTRIBUTES);

/**
 * Represents a product transaction, except for it's typeid
 */
export interface ProductTransactionDb {
  producttransactionuuid?: string;
  productname: string;
  productunits: string;
  datetime: string;
  topersonuuid: string;
  frompersonuuid: string;
  amountofproduct: number;
  costperunit: number;
  currency: string;
  lastmodified: string;
}

interface insertProductTransactionDb {
  producttypeid: string;
  datetime: string;
  topersonuuid: string;
  frompersonuuid: string;
  amountofproduct: number;
  costperunit: number;
  currency: string;
  lastmodified: string;
}

export interface ProductTransactionAttributeDb {
  producttransactionuuid: string;
  attrname: string;
  attrvalue: string;
}

interface ProductTransaction {
  uuid: string;
  productType: string;
  productUnits: string;
  datetime: string;
  toPersonUuid: string;
  fromPersonUuid: string;
  amountOfProduct: number;
  costPerUnit: number;
  currency: string;
  lastModified: string;

  milkQuality?: string;
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

  /** get all attributes and their values for a products certain type */
  getProductTransactionsAttributeValues(productname: string) {
    return productTransactionsAttributesTable().select('producttransactionuuid', 'attrname', 'attrvalue')
    .join(tableNames.PRODUCT_TYPE_TRANSACTION_ATTRIBUTES,
        tableNames.PRODUCT_TYPE_TRANSACTION_ATTRIBUTES + '.attrid',
        tableNames.PRODUCT_TRANSACTION_ATTRIBUTES + '.attrid')
    .join(tableNames.PRODUCT_TYPES,
        tableNames.PRODUCT_TYPE_TRANSACTION_ATTRIBUTES + '.producttypeid',
        tableNames.PRODUCT_TYPES + '.producttypeid')
    .where({ productname });
  },

  insertProductTransaction(transaction: insertProductTransactionDb) {
    return productTransactionsTable()
    .returning('producttransactionuuid')
    .insert(transaction);
  },

  getAttributeId(attrname: string) {
    return productTypeTransactionAttributesTable()
    .select('attrid')
    .where({ attrname });
  },

  insertAttibuteValue(producttransactionuuid: string, attrvalue: string, attrid: number) {
    return productTransactionsAttributesTable()
    .insert({ producttransactionuuid, attrid, attrvalue });
  },

  getProductTypeId(productname: string) {
    return productTypesTable()
    .select('producttypeid')
    .where({ productname });
  }
};

/** Get all product transactions of a certain type */
export async function getProductTransactions(productType: string): Promise<ProductTransaction[]> {
  const transactions = await execute<ProductTransactionDb[]>(builders.getProductTransactions(productType));
  const attrValues = await execute<ProductTransactionAttributeDb[]>(builders.getProductTransactionsAttributeValues(productType));
  const results : ProductTransaction[] = [];

  transactions.forEach(function (item) {
    const isMatchingUuid = R.propEq('producttransactionuuid', item.producttransactionuuid);

    const isMilkQualityAttr = R.propEq('attrname', 'milkQuality');
    const milkQualityAttr = R.find(R.allPass([isMatchingUuid, isMilkQualityAttr]))(attrValues);

    const transaction : ProductTransaction = {
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

    if (milkQualityAttr) {
      transaction.milkQuality = milkQualityAttr.attrvalue;
    }

    results.push(transaction);
  });

  return results;
}

export async function insertProductTransaction(
  transaction: ProductTransactionDb,
  attributes: ProductTransactionAttributeDb[]): Promise<string> {

  const productId = await builders.getProductTypeId(transaction.productname);

  const insertTransaction: insertProductTransactionDb = {
    producttypeid: productId[0].producttypeid,
    datetime: transaction.datetime,
    topersonuuid: transaction.topersonuuid,
    frompersonuuid: transaction.frompersonuuid,
    amountofproduct: transaction.amountofproduct,
    costperunit: transaction.costperunit,
    currency: transaction.currency,
    lastmodified: transaction.lastmodified,
  }

  const newUuid = await builders.insertProductTransaction(insertTransaction);

  attributes.forEach(async function (attr) {
    const attrId = await builders.getAttributeId(attr.attrname);
    await execute<any>(builders.insertAttibuteValue(newUuid[0], attr.attrvalue, attrId[0].attrid));
  });

  return newUuid;
}
