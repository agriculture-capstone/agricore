import { Logger, transports, LoggerInstance } from 'winston';
import * as path from 'path';
import * as morgan from 'morgan';

import { LoggerMethods, Loggers, LogMessage, Level } from '@/models/logger';
import levels from '@/utilities/modules/logger/levels';
import { CORE_ROOT } from '@/utilities/root';

let loggers: Loggers = null;
let priorityFilter: number = null;
let loggerMethods = Object.assign(
  {},
  ...levels.map(({ name }) => {
    const errFn = () => { throw new Error('Logger has not been initialized'); };
    return {
      [name]: errFn,
    };
  }),
) as LoggerMethods;

/**
 * Resolve path for filename in CORE_ROOT/logs
 * @param {string} filename the name of the log file
 */
function resolve(filename: string) {
  return path.resolve(CORE_ROOT, 'logs', filename);
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

  switch (name) {
    case 'error':
    case 'warn':
      fn = function (...msg: LogMessage[]) {
        // Unshift stack message to front of message array
        const stackMsg = [...msg].unshift(new Error().stack);
        if (priorityFilter > priority) {
          loggers[name].log(name, prepareMessage(stackMsg));
        }
      };

    default:
      fn = function (...msg: LogMessage[]) {
        if (priorityFilter > priority) {
          loggers[name].log(name, prepareMessage(msg));
        }
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
export function init() {
  if (loggers) {
    throw new Error('Already initialized logger');
  }

  loggerMethods = Object.assign(
    loggerMethods,
    ...levels.map(generateLoggerMethod),
  ) as LoggerMethods;

  priorityFilter = levels.find(l => l.name === process.env.LOG_LEVEL).priority || levels.find(l => l.name === 'info').priority;

  loggers = Object.assign({}, ...levels.map(generateLogger));
}

/** Reset the logger instance for testing purposes */
export function reset() {
  if (process.env.NODE_ENV !== 'test') {
    throw new Error('reset should only be called in a test environment');
  }
  loggers = null;
}

export default loggerMethods;
