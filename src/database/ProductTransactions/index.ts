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
export interface prodTransactionDbInsertReq {
  producttypeid: number;
  producttransactionuuid: string;
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
  producttransactionuuid?: string;
  attrname: string;
  attrvalue: string;
}

const builders = {
  /** Get all product transactions of a certain type */
  getSingleProdTransaction(producttransactionuuid: string) {
    return prodTransactionTable().select('*')
    .where({ producttransactionuuid });
  },
  /** Get all product transactions of a certain type */
  getProdTransactions(productname: string) {
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

  getSingleProdTransactionAttrValues(producttransactionuuid: string) {
    return prodTransactionAttrsTable().select('producttransactionuuid', 'attrname', 'attrvalue')
    .join(tableNames.PRODUCT_TYPE_TRANSACTION_ATTRIBUTES,
        tableNames.PRODUCT_TYPE_TRANSACTION_ATTRIBUTES + '.attrid',
        tableNames.PRODUCT_TRANSACTION_ATTRIBUTES + '.attrid')
    .where({ producttransactionuuid });
  },
  /** Get the id of a product type */
  getProdTypeId(productname: string) {
    return prodTypesTable()
    .select('producttypeid')
    .where({ productname });
  },

  /** Get the id of a product attribute type */
  getAttrId(attrname: string) {
    return prodTypeTransactionAttrsTable()
    .select('attrid')
    .where({ attrname });
  },

  /** inserts a ProductTransaction row in the database */
  insertProdTransaction(transaction: prodTransactionDbInsertReq) {
    return prodTransactionTable()
    .returning('producttransactionuuid')
    .insert(transaction);
  },

  /** inserts a single product attribute row in the database */
  insertAttibuteValue(producttransactionuuid: string, attrvalue: string, attrid: number) {
    return prodTransactionAttrsTable()
    .insert({ producttransactionuuid, attrid, attrvalue });
  },

  /** updates a single product field in the database */
  updateProdTransactionField(producttransactionuuid: string, field: string, value: any) {
    return prodTransactionTable()
      .update(field, value)
      .where({ producttransactionuuid })
  },

  /** updates a single product field in the database */
  updateProdTransactionAttr(producttransactionuuid: string, attrname: string, attrvalue: any) {
    return prodTransactionAttrsTable()
      .update('attrvalue', attrvalue)
      .where({ producttransactionuuid, attrname })
  }
};

/** Get all product transactions of a certain type */
export async function getProdTransaction(uuid: string): Promise<ProdTransactionDb> {
  const transactions = await execute<ProdTransactionDb[]>(builders.getSingleProdTransaction(uuid));
  const attrValues = await execute<ProdTransactionAttrDb[]>(builders.getSingleProdTransactionAttrValues(uuid));
  const transaction = transactions[0];

  const isMatchingUuid = R.propEq('producttransactionuuid', transaction.producttransactionuuid);
  const isMilkQualityAttr = R.propEq('attrname', 'milkQuality');

  const milkQualityAttr = R.find(R.allPass([isMatchingUuid, isMilkQualityAttr]))(attrValues);

  transaction.attributes = [];

  if (milkQualityAttr) {
    transaction.attributes.push(milkQualityAttr);
  }

  return transaction;
}

/** Get all product transactions of a certain type */
export async function getProdTransactions(productType: string): Promise<ProdTransactionDb[]> {
  const transactions = await execute<ProdTransactionDb[]>(builders.getProdTransactions(productType));
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

/** creates a new product transaction in the database, returns the new UUID */
export async function insertProdTransaction(
  req: prodTransactionDbInsertReq,
  attributes: ProdTransactionAttrDb[]): Promise<string> {

  const newUuid = await execute<any>(builders.insertProdTransaction(req));

  attributes.forEach(async function (attr) {
    const attrId = await execute<any>(builders.getAttrId(attr.attrname));
    await execute<any>(builders.insertAttibuteValue(newUuid[0], attr.attrvalue, attrId[0].attrid));
  });

  return newUuid[0];
}


  /** Get the id of a product type, used for bulding prodTransactionDbInsertReq */
export async function getProductId(productType: string): Promise<any> {
  const productId = await execute<any>(builders.getProdTypeId(productType));
  return productId[0].producttypeid;
}

export async function updateProdTransactionField(uuid: string, field: string, value: string|number) {
  return await execute<any>(builders.updateProdTransactionField(uuid, field, value));
}

export async function updateProdTransactionAttr(uuid: string, attr: string, value: string) {
  return await execute<any>(builders.updateProdTransactionAttr(uuid, attr, value));
}
