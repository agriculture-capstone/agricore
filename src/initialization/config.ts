import { config } from 'dotenv';
import * as path from 'path';

import { CORE_ROOT } from '@/utilities/root';
import { InitError } from '../errors/InitError';

/** Possible types of input */
type TypeOf = 'string' | 'number';

interface EnvironmentVariables {
  [key: string]: TypeOf;
}

const ENV_VARS: EnvironmentVariables = {
  PORT: 'number',
  DB_CLIENT: 'string',
  DB_HOST: 'string',
  DB_NAME: 'string',
  DB_USER: 'string',
  DB_PASS: 'string',
  JWT_SECRET: 'string',
  JWT_ISSUER: 'string',
  JWT_AUDIENCE: 'string',
  JWT_EXPIRES: 'number',
  LOG_LEVEL: 'string',
};

/**
 * Perform initialization for config
 *
 * @throws {InitWarning} If environment variables are not found
 */
export function initConfig() {
  // read in environment variables from '.env' file
  config({
    path: path.join(CORE_ROOT, '.env'),
  });

  const errors: string[] = [];

  // Validate environment variables
  Object.keys(ENV_VARS).map((name) => {
    const envVar = process.env[name];

    if (typeof(envVar) === 'undefined') {
      return void errors.push(undefinedMsg(name));
    }

    const expectedType = ENV_VARS[name];
    const actualType = typeof(envVar);
    if (expectedType !== actualType) {
      return void errors.push(wrongTypeMsg(name, expectedType, actualType));
    }
  });

  // If problems, raise error
  if (errors) {
    errors.unshift('Problems with configuration values:');
    errors.push('Please see README for instructions how to configure application');
    const errorMsg = errors.join('\n');
    throw new InitError(errorMsg);
  }
}

function undefinedMsg(name: string) {
  return `Configuration value '${name}' not found`;
}

function wrongTypeMsg(name: string, expectedType: string, actualType: string) {
  return `Configuration value '${name}' should be a ${expectedType}, is a ${actualType}`;
}
