import * as api from '@/routers/transactions/money';
import * as db from '@/database/MoneyTransactions';

/** message when an unhandled error is thrown */
export const unhandledErrorMsg = 'unhandled error';

/**
 * Connector for the API and database to get a single moneyTransaction
 */
export async function getMoneyTransactionFromDb(uuid: string): Promise<api.MoneyTransaction> {
  const item: db.MoneyTransactionDb = await db.getMoneyTransaction(uuid);
  const moneyTransaction: api.MoneyTransaction = {
    uuid: item.moneytransactionuuid,

    datetime: item.datetime,
    toPersonUuid: item.topersonuuid,
    fromPersonUuid: item.frompersonuuid,
    amount: item.amount,
    currency: item.currency,
    toPersonName: formatName(item.tofirstname, item.tomiddlename, item.tolastname),
    fromPersonName: formatName(item.fromfirstname, item.frommiddlename, item.fromlastname),
    lastModified: item.lastmodified,
  };

  return moneyTransaction;
}

/**
 * Connector for the API and database to getting all MoneyTransactions
 */
export async function getMoneyTransactionsFromDb(): Promise<api.MoneyTransaction[]> {
  const dbMoneyTransactions: db.MoneyTransactionDb[] = await db.getMoneyTransactions();
  const results: api.MoneyTransaction[] = dbMoneyTransactions.map(function (item: db.MoneyTransactionDb) {
    const moneyTransaction: api.MoneyTransaction = {
      uuid: item.moneytransactionuuid,

      datetime: item.datetime,
      toPersonUuid: item.topersonuuid,
      fromPersonUuid: item.frompersonuuid,
      amount: item.amount,
      currency: item.currency,
      toPersonName: formatName(item.tofirstname, item.tomiddlename, item.tolastname),
      fromPersonName: formatName(item.fromfirstname, item.frommiddlename, item.fromlastname),
      lastModified: item.lastmodified,
    };

    return moneyTransaction;
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
 * Connector for the API and database to create a new moneyTransaction
 * Throws error on invalid request
 * Throws error with message "unhandled error" for unhandled errors
 */
export async function createMoneyTransactionInDb(apiReq: api.MoneyTransactionCreationReq): Promise<string> {
  const invalidFields: string[] = [];

  // validate request
  if (!apiReq.uuid) {
    invalidFields.push('uuid');
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
  const dbInsertReq: db.moneyTransactionsDbInsertReq = {
    moneytransactionuuid: apiReq.uuid,
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
    newUuid = await db.insertMoneyTransaction(dbInsertReq);
  } catch (e) {
    throw new Error(unhandledErrorMsg);
  }
  return newUuid;
}

/**
 * Connector for the API and database to update a moneyTransaction
 * Throws error with message "unhandled error" for unhandled errors
 */
export async function updateMoneyTransactionInDb(apiReq: api.MoneyTransactionUpdateReq) {
  try {
    if (apiReq.datetime) {
      await db.updateMoneyTransactionField(apiReq.uuid, 'datetime', apiReq.datetime);
    }
    if (apiReq.toPersonUuid) {
      await db.updateMoneyTransactionField(apiReq.uuid, 'topersonuuid', apiReq.toPersonUuid);
    }
    if (apiReq.fromPersonUuid) {
      await db.updateMoneyTransactionField(apiReq.uuid, 'frompersonuuid', apiReq.fromPersonUuid);
    }
    if (apiReq.amount) {
      await db.updateMoneyTransactionField(apiReq.uuid, 'amount', apiReq.amount);
    }
    if (apiReq.currency) {
      await db.updateMoneyTransactionField(apiReq.uuid, 'currency', apiReq.currency);
    }
  } catch (e) {
    throw new Error(unhandledErrorMsg);
  }

  await db.updateMoneyTransactionField(apiReq.uuid, 'lastmodified', new Date().toISOString());
  return;
}
