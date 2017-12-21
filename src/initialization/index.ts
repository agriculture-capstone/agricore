import { initDatabase } from './database';
import { initConfig } from './config';
import { initLogger } from './logger';
import { InitError } from '@/errors/InitError';
import logger from '@/utilities/modules/logger';
import { initExpress } from '@/initialization/express';

/**
 * Perform initialization for application on startup
 *
 * @async
 */
export async function init() {
  try {
    initConfig();
  } catch (err) {
    initLogger();
    report(logger, err);
  }

  try {
    initLogger();
    await initDatabase();

    return initExpress();
  } catch (err) {
    report(logger, err);
  }
}

function report(logger: any, err: any) {
  if (err instanceof InitError) {
    logger.warn(err.message);
  } else {
    logger.error(err);
  }
}
