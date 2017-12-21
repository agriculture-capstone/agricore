import { connect } from '@/database/connection';
import { InitError } from '@/errors/InitError';

/**
 * Perform initialization for database
 *
 * Initialize connection to database
 *
 * @async
 */
export async function initDatabase() {
  try {
    await connect();
  } catch (e) {
    throw new InitError('Failed to connect to database');
  }
}
