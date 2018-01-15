import { Logger, transports } from 'winston';
import * as path from 'path';
import * as morgan from 'morgan';

import { LogFunctions, WinstonLoggers, LogMessage, Level } from '@/models/logger';
import levels from '@/utilities/modules/logger/levels';
import { CORE_ROOT } from '@/utilities/root';

let winstonLoggers: WinstonLoggers = null;
let priorityFilter: number = null;
let logFunctions = Object.assign(
  {},
  ...levels.map(({ name }) => {
    const errFn = () => { throw new Error('Logger has not been initialized'); };
    return {
      [name]: errFn,
    };
  }),
) as LogFunctions;

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
          level: name,
        }),
      ],
    }),
  };
}

/** Prepare objects for the logger */
function prepareMessage(...msg: LogMessage[]): string {
  return msg.map(m => JSON.stringify(m)).join(',');
}

/**
 * Create a logger method that uses logger of 'name'
 *
 * @param {string} name Name of logger method to create
 */
function generateLoggerMethod({ name, priority }: Level) {
  let fn: (...msg: LogMessage) => void = null;

  switch (name) {
    case 'error':
    case 'warn':
      fn = function (...msg: LogMessage) {
        if (priorityFilter >= priority) {
          // Unshift stack message to front of message array
          const stackMsg = [...msg];
          stackMsg.push(new Error().stack);
          winstonLoggers[name].log(name, prepareMessage(...stackMsg));
        }
      };
      break;

    default:
      fn = function (...msg: LogMessage) {
        if (priorityFilter >= priority) {
          winstonLoggers[name].log(name, prepareMessage(...msg));
        }
      };
      break;
  }

  return {
    [name]: fn,
  };
}

/** Creates network logger */
export function createNetworkLogger(networkLogger = morgan) {
  const infoLogger = winstonLoggers['info'];
  const stream = {
    /** write to stream */
    write(message: string) {
      infoLogger.log('info', message);
    },
  };

  return networkLogger('combined', {
    stream,
  });
}

/**
 * Initialize the logger
 */
export function init() {
  if (winstonLoggers) {
    throw new Error('Already initialized logger');
  }

  logFunctions = Object.assign(
    logFunctions,
    ...levels.map(generateLoggerMethod),
  ) as LogFunctions;

  const configLevel = levels.find(l => l.name === process.env.LOG_LEVEL);
  priorityFilter = configLevel ? configLevel.priority : levels.find(l => l.name === 'info').priority;

  winstonLoggers = Object.assign({}, ...levels.map(generateLogger));
}

/** Reset the logger instance for testing purposes */
export function reset() {
  if (process.env.NODE_ENV !== 'test') {
    throw new Error('reset should only be called in a test environment');
  }
  winstonLoggers = null;
}

export default logFunctions;
