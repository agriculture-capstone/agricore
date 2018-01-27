import { config } from 'dotenv';
import * as path from 'path';

import { CORE_ROOT } from '@/utilities/root';
import { InitWarning } from '../errors/InitError';
import { EnvironmentVariables } from '@/models/initialization/config';

const ENV_VARS: EnvironmentVariables = {
  PORT: {
    expectedType: Number,
    required: true,
  },
  DB_CLIENT: {
    expectedType: String,
    required: true,
  },
  DB_HOST: {
    expectedType: String,
    required: true,
  },
  DB_PORT: {
    expectedType: Number,
    required: false,
  },
  DB_NAME: {
    expectedType: String,
    required: true,
  },
  DB_USER: {
    expectedType: String,
    required: true,
  },
  DB_PASS: {
    expectedType: String,
    required: true,
  },
  JWT_SECRET: {
    expectedType: String,
    required: true,
  },
  JWT_ISSUER: {
    expectedType: String,
    required: true,
  },
  JWT_AUDIENCE: {
    expectedType: String,
    required: false,
  },
  JWT_EXPIRES: {
    expectedType: Number,
    required: false,
  },
  LOG_LEVEL: {
    expectedType: String,
    required: true,
  },
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
    const { expectedType, required } = ENV_VARS[name];

    if (required && envVar === '') {
      return void errors.push(undefinedMsg(name));
    }

    // Validate type correctness
    if (Number.isNaN(expectedType(envVar) as any)) {
      throw new Error('Invalid type');
    }
  });

  // If problems, raise error
  if (errors.length) {
    errors.unshift('Problems with configuration values:');
    errors.push('Please see README for instructions how to configure application');
    const errorMsg = errors.join('. ');
    throw new InitWarning(errorMsg);
  }
}

function undefinedMsg(name: string) {
  return `Configuration value '${name}' not found`;
}
