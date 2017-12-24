import { config } from 'dotenv';
import * as path from 'path';

import { CORE_ROOT } from '@/utilities/root';
import { InitError } from '../errors/InitError';

/** Possible types of input */
type PossibleTypes = StringConstructor | NumberConstructor;

interface EnvironmentVariables {
  [key: string]: PossibleTypes;
}

const ENV_VARS: EnvironmentVariables = {
  PORT: Number,
  DB_CLIENT: String,
  DB_HOST: String,
  DB_NAME: String,
  DB_USER: String,
  DB_PASS: String,
  JWT_SECRET: String,
  JWT_ISSUER: String,
  JWT_AUDIENCE: String,
  JWT_EXPIRES: Number,
  LOG_LEVEL: String,
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

    if (typeof(envVar) === 'undefined' || envVar === '') {
      return void errors.push(undefinedMsg(name));
    }

    const expectedType = ENV_VARS[name];

    try {
      expectedType(envVar);
    } catch (e) {
      return void errors.push(wrongTypeMsg(name, envVar, expectedType));
    }
  });

  // If problems, raise error
  if (errors) {
    errors.unshift('Problems with configuration values:');
    errors.push('Please see README for instructions how to configure application');
    const errorMsg = errors.join('. ');
    throw new InitError(errorMsg);
  }
}

function undefinedMsg(name: string) {
  return `Configuration value '${name}' not found`;
}

function wrongTypeMsg(name: string, value: string, expectedType: PossibleTypes) {
  return `Configuration value '${name}' with value ${value} should be a ${expectedType}`;
}
