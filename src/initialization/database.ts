import { connect } from '@/database/connection';
import { InitWarning } from '@/errors/InitError';

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
    throw new InitWarning('Failed to connect to database');
  }
}
