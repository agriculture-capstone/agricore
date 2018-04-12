import dbConnection, { tableNames, execute } from '../connection';
import {
  MoneyTransactionDb,
  moneyTransactionsDbInsertReq,
  insertMoneyTransaction,
  updateMoneyTransactionField,
  deleteMoneyTransaction,
} from '../MoneyTransactions';

const productPaymentsTable = () => dbConnection()(tableNames.PRODUCT_PAYMENTS);

/**
 * Represent a prouduct payment with money transactions attrobutes
 * after retrieval from the database
 */
export interface ProductPaymentDb extends MoneyTransactionDb {
  productpaymentuuid: string;
  producttransactionuuid: string;
}

/**
 * Represent a productPayment after retrieval from the database
 */
export interface productPaymentMinimal {
  productpaymentuuid: string;
  producttransactionuuid: string;
  moneytransactionuuid: string;
}

/**
 * Represent a productPayment used in an INSERT call on the database
 */
export interface productPaymentDbInsertReq extends moneyTransactionsDbInsertReq {
  productpaymentuuid: string;
  producttransactionuuid: string;
}

const builders = {
  /** Gets a single productPayment row in the database */
  getSingleProductPayment(productpaymentuuid: string) {
    return productPaymentsTable()
    .select(tableNames.PRODUCT_PAYMENTS + '.*',
      'fromperson.firstname as fromfirstname',
      'fromperson.middlename as frommiddlename',
      'fromperson.lastname as fromlastname',
      'toperson.firstname as tofirstname',
      'toperson.middlename as tomiddlename',
      'toperson.lastname as tolastname',
      tableNames.MONEY_TRANSACTIONS + '.*',
    )
    .join(tableNames.MONEY_TRANSACTIONS,
      tableNames.MONEY_TRANSACTIONS + '.moneytransactionuuid',
      tableNames.PRODUCT_PAYMENTS + '.moneytransactionuuid')
    .join(tableNames.PEOPLE + ' as fromperson',
      tableNames.MONEY_TRANSACTIONS + '.frompersonuuid',
      'fromperson.personuuid')
     .join(tableNames.PEOPLE + ' as toperson',
      tableNames.MONEY_TRANSACTIONS + '.topersonuuid',
      'toperson.personuuid')
    .orderBy('fromlastname', 'asc')
    .orderBy('datetime', 'asc')
    .where({ productpaymentuuid });
  },

  /** Gets all productPayment rows in the database */
  getProductPayments() {
    return productPaymentsTable()
    .select(tableNames.PRODUCT_PAYMENTS + '.*',
      'fromperson.firstname as fromfirstname',
      'fromperson.middlename as frommiddlename',
      'fromperson.lastname as fromlastname',
      'toperson.firstname as tofirstname',
      'toperson.middlename as tomiddlename',
      'toperson.lastname as tolastname',
      tableNames.MONEY_TRANSACTIONS + '.*',
    )
    .join(tableNames.MONEY_TRANSACTIONS,
      tableNames.MONEY_TRANSACTIONS + '.moneytransactionuuid',
      tableNames.PRODUCT_PAYMENTS + '.moneytransactionuuid')
    .join(tableNames.PEOPLE + ' as fromperson',
      tableNames.MONEY_TRANSACTIONS + '.frompersonuuid',
      'fromperson.personuuid')
     .join(tableNames.PEOPLE + ' as toperson',
      tableNames.MONEY_TRANSACTIONS + '.topersonuuid',
      'toperson.personuuid')
    .orderBy('fromlastname', 'asc')
    .orderBy('datetime', 'asc');
  },

  /** inserts a Product Payment row in the database */
  insertProductPayment(productPayment: productPaymentMinimal) {
    return productPaymentsTable()
    .returning('productpaymentuuid')
    .insert(productPayment);
  },

  /** updates a single productPayment field in the database */
  updateProductPaymentField(productpaymentuuid: string, field: string, value: any) {
    return productPaymentsTable()
      .update(field, value)
      .where({ productpaymentuuid });
  },
};

/** Get a single product payment */
export async function getProductPayment(uuid: string): Promise<ProductPaymentDb> {
  const productPayments = await execute<ProductPaymentDb[]>(builders.getSingleProductPayment(uuid));
  const productPayment = productPayments[0];
  return productPayment;
}

/** Get all product payments */
export async function getProductPayments(): Promise<ProductPaymentDb[]> {
  const productPayments = await execute<ProductPaymentDb[]>(builders.getProductPayments());
  return productPayments;
}

/** creates a new productPayment transaction in the database, returns the new UUID */
export async function insertProductPayment(req: productPaymentDbInsertReq): Promise<string> {
  const moneyTransactionDbInsertReq: moneyTransactionsDbInsertReq = {
    datetime: req.datetime,
    topersonuuid: req.topersonuuid,
    frompersonuuid: req.frompersonuuid,
    amount: req.amount,
    currency: req.currency,
    lastmodified: req.lastmodified,
  };

  const moneyTransactionUuid = await insertMoneyTransaction(moneyTransactionDbInsertReq);

  const productPaymentReq: productPaymentMinimal = {
    productpaymentuuid: req.productpaymentuuid,
    producttransactionuuid: req.producttransactionuuid,
    moneytransactionuuid: moneyTransactionUuid,
  };
  const newUuid = await execute<any>(builders.insertProductPayment(productPaymentReq)).catch(async function (error) {
    await deleteMoneyTransaction(moneyTransactionUuid);
    throw error;
  });

  return newUuid[0];
}

/** Update a single column for a single productPayment transaction */
export async function updateProductPaymentField(uuid: string, field: string, value: string|number) {
  const productPayment = await execute<any>(builders.getSingleProductPayment(uuid));
  await updateMoneyTransactionField(productPayment[0].moneytransactionuuid, 'lastmodified', new Date().toISOString());
  return updateMoneyTransactionField(productPayment[0].moneytransactionuuid, field, value);
}
