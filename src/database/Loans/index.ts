import dbConnection, { tableNames, execute } from '../connection';
import {
  MoneyTransactionDb,
  moneyTransactionsDbInsertReq,
  insertMoneyTransaction,
  updateMoneyTransactionField,
  deleteMoneyTransaction,
} from '../MoneyTransactions';

const loansTable = () => dbConnection()(tableNames.LOANS);

/**
 * Represent a loan with money transactions attrobutes
 * after retrieval from the database
 */
export interface LoanDb extends MoneyTransactionDb {
  loanuuid: string;
  moneytransactionuuid: string;
  duedate: string;
}

/**
 * Represent a loan after retrieval from the database
 */
export interface LoanDbMinimal {
  loanuuid: string;
  moneytransactionuuid: string;
  duedate: string;
}

/**
 * Represent a loan used in an INSERT call on the database
 */
export interface loanDbInsertReq extends moneyTransactionsDbInsertReq {
  loanuuid: string;
  duedate: string;
}

const builders = {
  /** Gets a single loan row in the database */
  getSingleLoan(loanuuid: string) {
    return loansTable()
    .select(tableNames.LOANS + '.*',
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
      tableNames.LOANS + '.moneytransactionuuid')
    .join(tableNames.PEOPLE + ' as fromperson',
      tableNames.MONEY_TRANSACTIONS + '.frompersonuuid',
      'fromperson.personuuid')
     .join(tableNames.PEOPLE + ' as toperson',
      tableNames.MONEY_TRANSACTIONS + '.topersonuuid',
      'toperson.personuuid')
    .orderBy('fromlastname', 'asc')
    .orderBy('datetime', 'asc')
    .where({ loanuuid });
  },

  /** Gets all loan rows in the database */
  getLoans() {
    return loansTable()
    .select(tableNames.LOANS + '.*',
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
      tableNames.LOANS + '.moneytransactionuuid')
    .join(tableNames.PEOPLE + ' as fromperson',
      tableNames.MONEY_TRANSACTIONS + '.frompersonuuid',
      'fromperson.personuuid')
     .join(tableNames.PEOPLE + ' as toperson',
      tableNames.MONEY_TRANSACTIONS + '.topersonuuid',
      'toperson.personuuid')
    .orderBy('fromlastname', 'asc')
    .orderBy('datetime', 'asc');
  },

  /** inserts a MoneyuctTransaction row in the database */
  insertLoan(loan: LoanDbMinimal) {
    return loansTable()
    .returning('loanuuid')
    .insert(loan);
  },

  /** updates a single loan field in the database */
  updateLoanField(loanuuid: string, field: string, value: any) {
    return loansTable()
      .update(field, value)
      .where({ loanuuid });
  },
};

/** Get all loan transactions of a certain type */
export async function getLoan(uuid: string): Promise<LoanDb> {
  const loans = await execute<LoanDb[]>(builders.getSingleLoan(uuid));
  const loan = loans[0];
  return loan;
}

/** Get all loan transactions of a certain type */
export async function getLoans(): Promise<LoanDb[]> {
  const transactions = await execute<LoanDb[]>(builders.getLoans());
  return transactions;
}

/** creates a new loan transaction in the database, returns the new UUID */
export async function insertLoan(req: loanDbInsertReq): Promise<string> {
  const moneyTransactionDbInsertReq: moneyTransactionsDbInsertReq = {
    datetime: req.datetime,
    topersonuuid: req.topersonuuid,
    frompersonuuid: req.frompersonuuid,
    amount: req.amount,
    currency: req.currency,
  };

  const moneyTransactionUuid = await insertMoneyTransaction(moneyTransactionDbInsertReq);

  const loanReq: LoanDbMinimal = {
    loanuuid: req.loanuuid,
    moneytransactionuuid: moneyTransactionUuid,
    duedate: req.duedate,
  };
  const newUuid = await execute<any>(builders.insertLoan(loanReq)).catch(async function (error) {
    await deleteMoneyTransaction(moneyTransactionUuid);
    throw error;
  });

  return newUuid[0];
}

/** Update a single column for a single loan transaction */
export async function updateLoanField(uuid: string, field: string, value: string|number) {
  if (field === 'duedate') {
    return await execute<any>(builders.updateLoanField(uuid, field, value));
  } else {
    const loan = await execute<any>(builders.getSingleLoan(uuid));
    return updateMoneyTransactionField(loan[0].moneytransactionuuid, field, value);
  }
}
