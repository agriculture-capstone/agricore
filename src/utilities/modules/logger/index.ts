import { Logger, transports, LoggerInstance } from 'winston';
import * as path from 'path';
import * as morgan from 'morgan';

import { LoggerMethods, Loggers, LogMessage, Level } from '@/models/logger';
import levels from '@/utilities/modules/logger/levels';
import { CORE_ROOT } from '@/utilities/root';

let loggers: Loggers = null;
let priorityFilter: number = null;

/**
 * Resolve path for filename in CORE_ROOT/logs
 * @param {string} filename the name of the log file
 */
function resolve(filename: string) {
  return path.resolve(CORE_ROOT, 'logs', filename);
}

/**
 * Perform check to ensure that loggers are initialized before usage
 */
function check() {
  if (!loggers) {
    throw new Error('Logger was not initialized');
  }
}

/**
 * Generate a logger dynamically
 *
 * @param {string} name Name of logger to create
 */
function generateLogger({ name, handleExceptions }: Level) {
  return {
    [name]: new (Logger)({
      transports: [
        new (transports.File)({
          handleExceptions,
          name: `${name}-file`,
          filename: resolve(`server-${name}.log`),
          level: name,
          json: true,
          maxsize: 5242880,
          maxFiles: 5,
          colorize: false,
        }),

        new (transports.Console)({
          handleExceptions,
          colorize: true,
        }),
      ],
    }),
  };
}

/** Prepare objects for the logger */
function prepareMessage(...msg: LogMessage[]): string {
  return msg.map(m => JSON.stringify(m)).join('\n');
}

/**
 * Create a logger method that uses logger of 'name'
 *
 * @param {string} name Name of logger method to create
 */
function generateLoggerMethod({ name, priority }: Level) {
  let fn: (msg: string) => void = null;

  /** Don't log anything if filtered by LOG_LEVEL */
  if (priority > priorityFilter) {
    return () => {};
  }

  switch (name) {
    case 'error':
    case 'warn':
      fn = function (...msg: LogMessage[]) {
        check();
        // Unshift stack message to front of message array
        const stackMsg = [...msg].unshift(new Error().stack);
        loggers[name].log(name, prepareMessage(stackMsg));
      };

    default:
      fn = function (...msg: LogMessage[]) {
        check();
        loggers[name].log(name, prepareMessage(msg));
      };
      break;
  }

  return {
    [name]: fn,
  };
}

function initMorgan(infoLogger: LoggerInstance) {
  const stream = {
    /** write to stream */
    write(message: string) {
      infoLogger.info(message);
    },
  };

  return morgan('combined', {
    stream,
  });
}

/** Creates network logger */
export function networkLogger() {
  return initMorgan(loggers['info']);
}

/**
 * Initialize the logger
 */
export function initLogger() {
  if (loggers) {
    throw new Error('Already initialized logger');
  }

  priorityFilter = levels.find(l => l.name === process.env.LOG_LEVEL).priority || levels.find(l => l.name === 'info').priority;

  loggers = Object.assign({}, ...levels.map(generateLogger));
}

const loggerMethods = Object.assign(
  {},
  ...levels.map(generateLoggerMethod),
) as LoggerMethods;

export default loggerMethods;
