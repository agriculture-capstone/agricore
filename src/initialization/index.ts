import * as ExpressServer from 'express';

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
  let loggerReady = false;

  try {
    initConfig();
  } catch (err) {
    // Init logger and report error
    initLogger();
    loggerReady = true;
    report(err);
  }

  // Initialize logger if not initialized
  !loggerReady && initLogger();

  try {
    await initDatabase();
  } catch (err) {
    report(err);
  }

  return initExpress(ExpressServer);
}

function report(err: any) {
  if (err instanceof InitError) {
    logger.warn(err.message);
  } else {
    logger.error(err);
  }
}
