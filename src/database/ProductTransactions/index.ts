import dbConnection, { tableNames, execute } from '../connection';

import * as R from 'ramda';

const prodTypesTable = () => dbConnection()(tableNames.PRODUCT_TYPES);
const prodTransactionTable = () => dbConnection()(tableNames.PRODUCT_TRANSACTIONS);
const prodTransactionAttrsTable = () => dbConnection()(tableNames.PRODUCT_TRANSACTION_ATTRIBUTES);
const prodTypeTransactionAttrsTable = () => dbConnection()(tableNames.PRODUCT_TYPE_TRANSACTION_ATTRIBUTES);

/**
 * Represent a product transaction after retrieval from the database
 */
export interface ProdTransactionDb {
  producttransactionuuid: string;
  productname: string;
  productunits: string;
  datetime: string;
  topersonuuid: string;
  frompersonuuid: string;
  amountofproduct: number;
  costperunit: number;
  currency: string;
  lastmodified: string;
  attributes: ProdTransactionAttrDb[];
}

/**
 * Represent a product transaction used in an INSERT call on the database
 */
interface insertProdTransactionDb {
  producttypeid: string;
  datetime: string;
  topersonuuid: string;
  frompersonuuid: string;
  amountofproduct: number;
  costperunit: number;
  currency: string;
  lastmodified: string;
}

/**
 * Represents a product transaction attribute in the database
 */
export interface ProdTransactionAttrDb {
  producttransactionuuid: string;
  attrname: string;
  attrvalue: string;
}

const builders = {
  /** Get all product transactions of a certain type */
  getProdTransaction(productname: string) {
    return prodTransactionTable().select('*')
    .join(tableNames.PRODUCT_TYPES,
      tableNames.PRODUCT_TYPES + '.producttypeid',
      tableNames.PRODUCT_TRANSACTIONS + '.producttypeid')
    .where({ productname });
  },

  /** get all attributes and their values for a products certain type */
  getProdTransactionAttrValues(productname: string) {
    return prodTransactionAttrsTable().select('producttransactionuuid', 'attrname', 'attrvalue')
    .join(tableNames.PRODUCT_TYPE_TRANSACTION_ATTRIBUTES,
        tableNames.PRODUCT_TYPE_TRANSACTION_ATTRIBUTES + '.attrid',
        tableNames.PRODUCT_TRANSACTION_ATTRIBUTES + '.attrid')
    .join(tableNames.PRODUCT_TYPES,
        tableNames.PRODUCT_TYPE_TRANSACTION_ATTRIBUTES + '.producttypeid',
        tableNames.PRODUCT_TYPES + '.producttypeid')
    .where({ productname });
  },

  insertProdTransaction(transaction: insertProdTransactionDb) {
    return prodTransactionTable()
    .returning('producttransactionuuid')
    .insert(transaction);
  },

  getAttrId(attrname: string) {
    return prodTypeTransactionAttrsTable()
    .select('attrid')
    .where({ attrname });
  },

  insertAttibuteValue(producttransactionuuid: string, attrvalue: string, attrid: number) {
    return prodTransactionAttrsTable()
    .insert({ producttransactionuuid, attrid, attrvalue });
  },

  getProdTypeId(productname: string) {
    return prodTypesTable()
    .select('producttypeid')
    .where({ productname });
  },
};

/** Get all product transactions of a certain type */
export async function getProdTransactions(productType: string): Promise<ProdTransactionDb[]> {
  const transactions = await execute<ProdTransactionDb[]>(builders.getProdTransaction(productType));
  const attrValues = await execute<ProdTransactionAttrDb[]>(builders.getProdTransactionAttrValues(productType));

  transactions.forEach(function (item) {
    item.attributes = [];

    const isMatchingUuid = R.propEq('producttransactionuuid', item.producttransactionuuid);
    const isMilkQualityAttr = R.propEq('attrname', 'milkQuality');

    const milkQualityAttr = R.find(R.allPass([isMatchingUuid, isMilkQualityAttr]))(attrValues);

    if (milkQualityAttr) {
      item.attributes.push(milkQualityAttr);
    }
  });

  return transactions;
}

export async function insertProdTransaction(
  transaction: ProdTransactionDb,
  attributes: ProdTransactionAttrDb[]): Promise<string> {

  const productId = await builders.getProdTypeId(transaction.productname);

  const insertTransaction: insertProdTransactionDb = {
    producttypeid: productId[0].producttypeid,
    datetime: transaction.datetime,
    topersonuuid: transaction.topersonuuid,
    frompersonuuid: transaction.frompersonuuid,
    amountofproduct: transaction.amountofproduct,
    costperunit: transaction.costperunit,
    currency: transaction.currency,
    lastmodified: transaction.lastmodified,
  };

  const newUuid = await builders.insertProdTransaction(insertTransaction);

  attributes.forEach(async function (attr) {
    const attrId = await builders.getAttrId(attr.attrname);
    await execute<any>(builders.insertAttibuteValue(newUuid[0], attr.attrvalue, attrId[0].attrid));
  });

  return newUuid;
}
