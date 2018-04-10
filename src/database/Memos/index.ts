import dbConnection, { tableNames, execute } from '../connection';

const memosTable = () => dbConnection()(tableNames.MEMOS);

/**
 * Represent a memo after retrieval from the database
 */
export interface MemoDb {
  memouuid: string;
  authoruuid: string;
  message: string;
  dateposted: string;

  authorfirstname: string;
  authormiddlename: string;
  authorlastname: string;
}

/**
 * Represent a memo used in an INSERT call on the database
 */
export interface MemoDbInsertReq {
  memouuid: string;
  authoruuid: string;
  message: string;
  dateposted: string;
}

const builders = {
  /** Get all memos */
  getMemos() {
    return memosTable()
    .select(tableNames.MEMOS + '.*',
      'people.firstname as authorfirstname',
      'people.middlename as authormiddlename',
      'people.lastname as authorlastname',
     )
      .join(tableNames.PEOPLE + ' as people',
      tableNames.MEMOS + '.authoruuid',
      'people.personuuid');
  },

  /** Inserts a new memo row in the database */
  insertMemo(memos: MemoDbInsertReq) {
    return memosTable()
    .returning('memouuid')
    .insert(memos);
  },
};

/** Get all memos */
export async function getMemos(): Promise<MemoDb[]> {
  const exports = await execute<MemoDb[]>(builders.getMemos());
  return exports;
}

/** creates a new memo in the database, returns the new UUID */
export async function insertMemo(req: MemoDbInsertReq): Promise<string> {
  const newUuid = await execute<any>(builders.insertMemo(req));
  return newUuid[0];
}
