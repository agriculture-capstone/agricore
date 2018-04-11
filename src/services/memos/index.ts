import * as api from '@/routers/memos';
import * as db from '@/database/Memos';

/** message when an unhandled error is thrown */
export const unhandledErrorMsg = 'unhandled error';

/**
 * Connector for the API and database to get all memos
 */
export async function getMemosFromDb(): Promise<api.Memo[]> {
  const dbMemos: db.MemoDb[] = await db.getMemos();
  const results: api.Memo[] = [];



  dbMemos.forEach(function (item: db.MemoDb) {
    const newExport: api.Memo = {
      memoUuid: item.memouuid,
      authorUuid: item.authoruuid,
      authorName: formatName(item.authorfirstname, item.authormiddlename, item.authorlastname),
      message: item.message,
      datePosted: item.dateposted,
    };

    results.push(newExport);
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
 * Connector for the API and database to create a new memo
 * Throws error on invalid request
 * Throws error with message "unhandled error" for unhandled errors
 */
export async function createMemoInDb(apiReq: api.MemoCreationReq): Promise<string> {
  const invalidFields: string[] = [];

  if (!apiReq.memoUuid) {
    invalidFields.push('memoUuid');
  }
  if (!apiReq.authorUuid) {
    invalidFields.push('authorUuid');
  }
  if (!apiReq.message) {
    invalidFields.push('message');
  }
  if (!apiReq.datePosted) {
    invalidFields.push('datePosted');
  }

  // throw error for any invalid fields
  if (invalidFields.length !== 0) {
    let errorMsg = 'The following fields are invalid or missing';
    invalidFields.forEach(function (invalidField) {
      errorMsg += ', ' + invalidField;
    });
    throw new Error(errorMsg);
  }

  // create database request
  const dbInsertReq: db.MemoDbInsertReq = {
    memouuid: apiReq.memoUuid,
    authoruuid: apiReq.authorUuid,
    message: apiReq.message,
    dateposted: apiReq.datePosted,
  };


  let newUuid: string;
  try {
    newUuid = await db.insertMemo(dbInsertReq);
  } catch (e) {
    throw new Error(unhandledErrorMsg);
  }
  return newUuid;
}
