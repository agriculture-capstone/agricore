import * as api from '@/routers/transactions/money/productPayments';
import * as db from '@/database/ProductPayments';

/** message when an unhandled error is thrown */
export const unhandledErrorMsg = 'unhandled error';

/**
 * Connector for the API and database to get a single productPayment
 */
export async function getProductPaymentFromDb(uuid: string): Promise<api.ProductPayment> {
  const dbProductPayment: db.ProductPaymentDb = await db.getProductPayment(uuid);
  const productPayment: api.ProductPayment = {
    uuid: dbProductPayment.productpaymentuuid,
    productTransactionUuid: dbProductPayment.producttransactionuuid,
    datetime: dbProductPayment.datetime,
    toPersonUuid: dbProductPayment.topersonuuid,
    fromPersonUuid: dbProductPayment.frompersonuuid,
    amount: dbProductPayment.amount,
    currency: dbProductPayment.currency,
    toPersonName: formatName(dbProductPayment.tofirstname, dbProductPayment.tomiddlename, dbProductPayment.tolastname),
    fromPersonName: formatName(dbProductPayment.fromfirstname, dbProductPayment.frommiddlename, dbProductPayment.fromlastname),
    lastModified: dbProductPayment.lastmodified,
  };

  return productPayment;
}

/**
 * Connector for the API and database to getting all ProductPayments
 */
export async function getProductPaymentsFromDb(): Promise<api.ProductPayment[]> {
  const dbProductPayments: db.ProductPaymentDb[] = await db.getProductPayments();
  const results: api.ProductPayment[] = dbProductPayments.map(function (item: db.ProductPaymentDb) {
    const productPayment: api.ProductPayment = {
      uuid: item.productpaymentuuid,
      productTransactionUuid: item.producttransactionuuid,

      datetime: item.datetime,
      toPersonUuid: item.topersonuuid,
      fromPersonUuid: item.frompersonuuid,
      amount: item.amount,
      currency: item.currency,
      toPersonName: formatName(item.tofirstname, item.tomiddlename, item.tolastname),
      fromPersonName: formatName(item.fromfirstname, item.frommiddlename, item.fromlastname),
      lastModified: item.lastmodified,
    };

    return productPayment;
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
 * Connector for the API and database to create a new productPayment
 * Throws error on invalid request
 * Throws error with message "unhandled error" for unhandled errors
 */
export async function createProductPaymentInDb(apiReq: api.ProductPaymentCreationReq): Promise<string> {
  const invalidFields: string[] = [];

  // validate request
  if (!apiReq.productTransactionUuid) {
    invalidFields.push('productTransactionUuid');
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
  const dbInsertReq: db.productPaymentDbInsertReq = {
    productpaymentuuid: apiReq.uuid,
    producttransactionuuid: apiReq.productTransactionUuid,
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
    newUuid = await db.insertProductPayment(dbInsertReq);
  } catch (e) {
    throw new Error(unhandledErrorMsg);
  }
  return newUuid;
}

/**
 * Connector for the API and database to update a productPayment
 * Throws error with message "unhandled error" for unhandled errors
 */
export async function updateProductPaymentInDb(apiReq: api.ProductPaymentUpdateReq) {
  try {
    if (apiReq.productTransactionUuid) {
      await db.updateProductPaymentField(apiReq.uuid, 'producttransactionuuid', apiReq.productTransactionUuid);
    }
    if (apiReq.datetime) {
      await db.updateProductPaymentField(apiReq.uuid, 'datetime', apiReq.datetime);
    }
    if (apiReq.toPersonUuid) {
      await db.updateProductPaymentField(apiReq.uuid, 'topersonuuid', apiReq.toPersonUuid);
    }
    if (apiReq.fromPersonUuid) {
      await db.updateProductPaymentField(apiReq.uuid, 'frompersonuuid', apiReq.fromPersonUuid);
    }
    if (apiReq.amount) {
      await db.updateProductPaymentField(apiReq.uuid, 'amount', apiReq.amount);
    }
    if (apiReq.currency) {
      await db.updateProductPaymentField(apiReq.uuid, 'currency', apiReq.currency);
    }
  } catch (e) {
    throw new Error(unhandledErrorMsg);
  }

  return;
}
