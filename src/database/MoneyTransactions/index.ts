import dbConnection, { tableNames, execute } from '../connection';


const moneyTransactionsTable = () => dbConnection()(tableNames.MONEY_TRANSACTIONS);

/**
 * Represent a money transaction after retrieval from the database
 */
export interface MoneyTransactionDb {
  moneytransactionuuid: string;
  datetime: string;
  topersonuuid: string;
  frompersonuuid: string;
  amount: number;
  currency: string;

  fromfirstname: string;
  frommiddlename: string;
  fromlastname: string;

  tofirstname: string;
  tomiddlename: string;
  tolastname: string;
}

/**
 * Represent a money transaction used in an INSERT call on the database
 */
export interface moneyTransactionsDbInsertReq {
  moneytransactionuuid?: string;
  datetime: string;
  topersonuuid: string;
  frompersonuuid: string;
  amount: number;
  currency: string;
}

const builders = {
  /** Get all money transactions of a certain type */
  getMoneyTransactions() {
    return moneyTransactionsTable()
    .select(tableNames.MONEY_TRANSACTIONS + '.*',
      'fromperson.firstname as fromfirstname',
      'fromperson.middlename as frommiddlename',
      'fromperson.lastname as fromlastname',
      'toperson.firstname as tofirstname',
      'toperson.middlename as tomiddlename',
      'toperson.lastname as tolastname',
      tableNames.PRODUCT_TYPES + '.*',
  )
    .join(tableNames.PEOPLE + ' as fromperson',
      tableNames.MONEY_TRANSACTIONS + '.frompersonuuid',
      'fromperson.personuuid')
      .join(tableNames.PEOPLE + ' as toperson',
      tableNames.MONEY_TRANSACTIONS + '.topersonuuid',
      'toperson.personuuid')
    .orderBy('fromlastname', 'asc')
    .orderBy('datetime', 'asc')
    ;
  },

  /** inserts a MoneyuctTransaction row in the database */
  insertMoneyTransaction(transaction: moneyTransactionsDbInsertReq) {
    return moneyTransactionsTable()
    .returning('moneytransactionuuid')
    .insert(transaction);
  },

  /** updates a single money field in the database */
  updateMoneyTransactionField(moneytransactionuuid: string, field: string, value: any) {
    return moneyTransactionsTable()
      .update(field, value)
      .where({ moneytransactionuuid });
  },

  /** Deletes a single money transaction row, use in case of error */
  deleteMoneyTransaction(moneytransactionuuid: string) {
    return moneyTransactionsTable()
      .where({ moneytransactionuuid })
      .delete();
  },
};

/** Get all money transactions of a certain type */
export async function getMoneyTransactions(): Promise<MoneyTransactionDb[]> {
  const transactions = await execute<MoneyTransactionDb[]>(builders.getMoneyTransactions());
  return transactions;
}

/** creates a new money transaction in the database, returns the new UUID */
export async function insertMoneyTransaction(
  req: moneyTransactionsDbInsertReq): Promise<string> {

  const newUuid = await execute<any>(builders.insertMoneyTransaction(req));

  return newUuid[0];
}

/** Update a single column for a single money transaction */
export async function updateMoneyTransactionField(uuid: string, field: string, value: string|number) {
  return await execute<any>(builders.updateMoneyTransactionField(uuid, field, value));
}

/** Delete a single money transaction row, use in case of error */
export async function deleteMoneyTransaction(uuid: string) {
  return await execute<any>(builders.deleteMoneyTransaction(uuid));
}
