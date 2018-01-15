import { LoggerInstance } from 'winston';

/**
 * The methods used in The Agricore to log at various priority levels
 */
export interface LogFunctions {
  /** Log using 'silly' level */
  silly: LogFunction;
  /** Log using 'debug' level */
  debug: LogFunction;
  /** Log using 'verbose' level */
  verbose: LogFunction;
  /** Log using 'info' level */
  info: LogFunction;
  /** Log using 'warn' level */
  warn: LogFunction;
  /** Log using 'error' level */
  error: LogFunction;
}

/** Definition for logger object */
export interface WinstonLoggers {
  [key: string]: LoggerInstance;
}

/** Logger function type */
export type LogFunction = (...msg: LogMessage) => void;

/** Input type for log messages */
export type LogMessage = any[];

/** A logging level */
export interface Level {
  name: 'silly' | 'verbose' | 'info' | 'warn' | 'error';
  priority: number;
  handleExceptions: boolean;
}
