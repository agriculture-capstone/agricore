import * as knex from 'knex';

import Table from '@/models/database/Table';
import logger from '@/utilities/modules/logger';

/*
* Here we create our connection to the database. For demonstration purposes, this is
* done using knex, but you can easily swap it out with your own database connection.
*/

let db: knex = null;

/**
 * Initialize the database connections based on env variables from `.env`
 */
export async function connect(createConnection = knex) {
  db = createConnection({
    client: process.env.DB_CLIENT,
    connection: {
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
    },
  });

  // Perform dummy query to test connection
  await Promise.resolve(db.raw('select 1 as dbIsUp'));
}

/** Names of tables in the database */
export const tableNames: Readonly<Table> = {
  USERS: 'users',
};

/**
 * Execute a QueryBuilder and normalize result to an ES6 promise
 *
 * @param {QueryBuilder} [qb] The query builder to execute and normalize
 * @returns {Promise<T>} A promise resolving to the result of the query
 * @async
 */
export async function execute<T>(qb: knex.QueryBuilder): Promise<T> {
  // Use Promise.resolve to normalize to a regular ES6 Promise
  const promise = Promise.resolve(
    // Call `then` merely to start the query to the database
    qb.then(v => v),
  );
  // Generic logging message to hide sensitive information from logs
  promise.catch((err) => {
    logger.error('Database error has occurred');
  });

  return promise;
}

/**
 * Reset the database connection
 */
export function reset() {
  db = null;
}

/**
 * Database Query API
 *
 * @returns {KnexInstance} The database connection
 *
 * @throws {Error} If connection has not been initialized with #connect
 */
export default function database() {
  if (!db) {
    throw new Error('Database connection has not been initialized');
  }
  return db;
}
