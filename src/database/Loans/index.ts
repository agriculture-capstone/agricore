import dbConnection, { tableNames, execute } from '../connection';
import { MoneyTransactionDb, moneyTransactionsDbInsertReq, insertMoneyTransaction } from '../MoneyTransactions'

const loansTable = () => dbConnection()(tableNames.LOANS);
const moneyTransactionsTable = () => dbConnection()(tableNames.MONEY_TRANSACTIONS);

/**
 * Represent a loan after retrieval from the database
 */
export interface LoanDb extends MoneyTransactionDb {
	loanuuid: string;
  moneytransactionuuid: string;
	duedate: string;
}

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
  /** Get all money transactions of a certain type */
  getLoans() {
    return loansTable()
    .select(tableNames.LOANS + '.*',
      'fromperson.firstname as fromfirstname',
      'fromperson.middlename as frommiddlename',
      'fromperson.lastname as fromlastname',
      'toperson.firstname as tofirstname',
      'toperson.middlename as tomiddlename',
      'toperson.lastname as tolastname',
      tableNames.PRODUCT_TYPES + '.*',
    )
    .join(tableNames.MONEY_TRANSACTIONS,
      tableNames.MONEY_TRANSACTIONS+ '.moneytransactionuuid',
      tableNames.LOANS + '.moneytransactionuuid',
      'fromperson.personuuid')
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
  insertLoan(loan: LoanDbMinimal) {
    return loansTable()
    .returning('loanuuid')
    .insert(loan);
  },

  /** updates a single loan field in the database */
  updateLoanField(loantransactionuuid: string, field: string, value: any) {
    return loansTable()
      .update(field, value)
      .where({ loantransactionuuid });
  },
};

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
    moneytransactionuuid: moneyTransactionUuid[0],
    duedate: req.duedate,
  };
  const newUuid = await execute<any>(builders.insertLoan(loanReq));

  return newUuid[0];
}

/** Update a single column for a single loan transaction */
export async function updateLoanField(uuid: string, field: string, value: string|number) {
  return await execute<any>(builders.updateLoanField(uuid, field, value));
}
