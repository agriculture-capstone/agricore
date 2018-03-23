import * as api from '@/routers/transactions/money/loans';
import * as db from '@/database/Loans';

/** message when an unhandled error is thrown */
export const unhandledErrorMsg = 'unhandled error';

/**
 * Connector for the API and database to get a single loan
 */
export async function getLoanFromDb(uuid: string): Promise<api.Loan> {
  const dbLoan: db.LoanDb = await db.getLoan(uuid);
  const loan: api.Loan = {
    uuid: dbLoan.loanuuid,
    dueDate: dbLoan.duedate,

    datetime: dbLoan.datetime,
    toPersonUuid: dbLoan.topersonuuid,
    fromPersonUuid: dbLoan.frompersonuuid,
    amount: dbLoan.amount,
    currency: dbLoan.currency,
    toPersonName: formatName(dbLoan.tofirstname, dbLoan.tomiddlename, dbLoan.tolastname),
    fromPersonName: formatName(dbLoan.fromfirstname, dbLoan.frommiddlename, dbLoan.fromlastname),
    lastModified: dbLoan.lastmodified,
  };

  return loan;
}

/**
 * Connector for the API and database to getting all Loans
 */
export async function getLoansFromDb(): Promise<api.Loan[]> {
  const dbLoans: db.LoanDb[] = await db.getLoans();
  const results: api.Loan[] = dbLoans.map(function (item: db.LoanDb) {
    const loan: api.Loan = {
      uuid: item.loanuuid,
      dueDate: item.duedate,

      datetime: item.datetime,
      toPersonUuid: item.topersonuuid,
      fromPersonUuid: item.frompersonuuid,
      amount: item.amount,
      currency: item.currency,
      toPersonName: formatName(item.tofirstname, item.tomiddlename, item.tolastname),
      fromPersonName: formatName(item.fromfirstname, item.frommiddlename, item.fromlastname),
      lastModified: item.lastmodified,
    };

    return loan;
  });

  return results;
}

/**
 * Formats a name for a person
 * @param firstName first name of a person
 * @param middleName middle name of a person
 * @param lastName last name of a person
 */
function formatName(firstName: string, middleName: string, lastName: string) {
  const names = middleName ? [firstName, middleName, lastName] : [firstName, lastName];
  return names.join(' ');
}

/**
 * Connector for the API and database to create a new loan
 * Throws error on invalid request
 * Throws error with message "unhandled error" for unhandled errors
 */
export async function createLoanInDb(apiReq: api.LoanCreationReq): Promise<string> {
  const invalidFields: string[] = [];

  // validate request
  if (!apiReq.uuid) {
    invalidFields.push('uuid');
  }
  if (!apiReq.dueDate) {
    invalidFields.push('dueDate');
  }
  if (!apiReq.datetime) {
    invalidFields.push('datetime');
  }
  if (!apiReq.toPersonUuid) {
    invalidFields.push('toPersonUuid');
  }
  if (!apiReq.fromPersonUuid) {
    invalidFields.push('fromPersonUuid');
  }
  if (!apiReq.amount) {
    invalidFields.push('amount');
  }
  if (!apiReq.currency) {
    invalidFields.push('currency');
  }

  // create database request
  const dbInsertReq: db.loanDbInsertReq = {
    loanuuid: apiReq.uuid,
    duedate: apiReq.dueDate,
    datetime: apiReq.datetime,
    topersonuuid: apiReq.toPersonUuid,
    frompersonuuid: apiReq.fromPersonUuid,
    amount: apiReq.amount,
    currency: apiReq.currency,
    lastmodified: new Date().toISOString(),
  };

  // throw error for any invalid fields
  if (invalidFields.length !== 0) {
    let errorMsg = 'The following fields are invalid or missing';
    invalidFields.forEach(function (invalidField) {
      errorMsg += ', ' + invalidField;
    });
    throw new Error(errorMsg);
  }

  let newUuid: string;
  try {
    newUuid = await db.insertLoan(dbInsertReq);
  } catch (e) {
    throw new Error(unhandledErrorMsg);
  }
  return newUuid;
}

/**
 * Connector for the API and database to update a loan
 * Throws error with message "unhandled error" for unhandled errors
 */
export async function updateLoanInDb(apiReq: api.LoanUpdateReq) {
  try {
    if (apiReq.dueDate) {
      await db.updateLoanField(apiReq.uuid, 'duedate', apiReq.dueDate);
    }
    if (apiReq.datetime) {
      await db.updateLoanField(apiReq.uuid, 'datetime', apiReq.datetime);
    }
    if (apiReq.toPersonUuid) {
      await db.updateLoanField(apiReq.uuid, 'topersonuuid', apiReq.toPersonUuid);
    }
    if (apiReq.fromPersonUuid) {
      await db.updateLoanField(apiReq.uuid, 'frompersonuuid', apiReq.fromPersonUuid);
    }
    if (apiReq.amount) {
      await db.updateLoanField(apiReq.uuid, 'amount', apiReq.amount);
    }
    if (apiReq.currency) {
      await db.updateLoanField(apiReq.uuid, 'currency', apiReq.currency);
    }
  } catch (e) {
    throw new Error(unhandledErrorMsg);
  }

  return;
}
