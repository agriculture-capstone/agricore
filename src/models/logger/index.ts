import { LoggerInstance } from 'winston';

/**
 * The methods used in The Agriculture Core to log at various priority levels
 */
export interface Logger {
  /** Log using 'silly' level */
  silly: LoggerFunction;
  /** Log using 'debug' level */
  debug: LoggerFunction;
  /** Log using 'verbose' level */
  verbose: LoggerFunction;
  /** Log using 'info' level */
  info: LoggerFunction;
  /** Log using 'warn' level */
  warn: LoggerFunction;
  /** Log using 'error' level */
  error: LoggerFunction;
}

/** Definition for logger object */
export interface WinstonLoggers {
  [key: string]: LoggerInstance;
}

/** Logger function type */
export type LoggerFunction = (...msg: LogMessage) => void;

/** Input type for log messages */
export type LogMessage = any[];

/** A logging level */
export interface Level {
  name: 'silly' | 'verbose' | 'info' | 'warn' | 'error';
  priority: number;
  handleExceptions: boolean;
}
