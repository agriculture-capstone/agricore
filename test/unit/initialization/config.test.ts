import { createSandbox, SinonStub } from 'sinon';
import { expect } from 'chai';
import * as dotenv from 'dotenv';

import { initConfig } from '@/initialization/config';
import logger from '@/utilities/modules/logger';
import { InitWarning } from '@/errors/InitError';

const sandbox = createSandbox();

interface SetupData {
  port: any;
  dbClient: any;
  dbHost: any;
  dbName: any;
  dbUser: any;
  dbPass: any;
  jwtSecret: any;
  jwtIssuer: any;
  jwtAudience: any;
  jwtExpires: any;
  logLevel: any;
}

interface TestStubs {
  error: SinonStub;
  warn: SinonStub;
  config: SinonStub;
}

/** Result of act */
enum Outcome {
  PASS = 'pass',
  ERROR = 'error',
  WARN = 'warn',
}

describe('configuration initialization', function () {
  const TEST_STRING = 'test_string';
  const TEST_NUMBER = '555';
  const EMPTY = '';
  let stubs: TestStubs = null;

  afterEach(() => sandbox.restore());

  beforeEach(function () {
    stubs = {
      error: sandbox.stub(logger, 'error'),
      warn: sandbox.stub(logger, 'warn'),
      config: sandbox.stub(dotenv, 'config'),
    };
  });

  /************************* Tests **************************/

  it('should have no warnings with valid config variables', function () {
    arrange({
      dbClient: TEST_STRING,
      dbHost: TEST_STRING,
      dbName: TEST_STRING,
      dbPass: TEST_STRING,
      dbUser: TEST_STRING,
      jwtAudience: TEST_STRING,
      jwtExpires: TEST_NUMBER,
      jwtIssuer: TEST_STRING,
      jwtSecret: TEST_STRING,
      logLevel: TEST_STRING,
      port: TEST_NUMBER,
    });

    actAndAssert(Outcome.PASS);
  });

  it('should have no warnings with missing optional variables', function () {
    arrange({
      dbClient: TEST_STRING,
      dbHost: TEST_STRING,
      dbName: TEST_STRING,
      dbPass: TEST_STRING,
      dbUser: TEST_STRING,
      jwtAudience: EMPTY,
      jwtExpires: EMPTY,
      jwtIssuer: TEST_STRING,
      jwtSecret: TEST_STRING,
      logLevel: TEST_STRING,
      port: TEST_NUMBER,
    });

    actAndAssert(Outcome.PASS);
  });

  it('should error if variable is invalid type', function () {
    arrange({
      dbClient: TEST_STRING,
      dbHost: TEST_STRING,
      dbName: TEST_STRING,
      dbPass: TEST_STRING,
      dbUser: TEST_STRING,
      jwtAudience: TEST_STRING,
      jwtExpires: TEST_STRING,
      jwtIssuer: TEST_STRING,
      jwtSecret: TEST_STRING,
      logLevel: TEST_STRING,
      port: TEST_NUMBER,
    });

    actAndAssert(Outcome.ERROR);
  });

  it('should warn if missing required variables', function () {
    arrange({
      dbClient: TEST_STRING,
      dbHost: TEST_STRING,
      dbName: TEST_STRING,
      dbPass: EMPTY,
      dbUser: TEST_STRING,
      jwtAudience: TEST_STRING,
      jwtExpires: TEST_NUMBER,
      jwtIssuer: TEST_STRING,
      jwtSecret: TEST_STRING,
      logLevel: TEST_STRING,
      port: TEST_NUMBER,
    });

    actAndAssert(Outcome.WARN);
  });

  /******************** Helper Functions ********************/

  function arrange(setupData: SetupData) {
    process.env.PORT = setupData.port;
    process.env.DB_CLIENT = setupData.dbClient;
    process.env.DB_HOST = setupData.dbHost;
    process.env.DB_NAME = setupData.dbName;
    process.env.DB_USER = setupData.dbUser;
    process.env.DB_PASS = setupData.dbPass;
    process.env.JWT_SECRET = setupData.jwtSecret;
    process.env.JWT_ISSUER = setupData.jwtIssuer;
    process.env.JWT_AUDIENCE = setupData.jwtAudience;
    process.env.JWT_EXPIRES = setupData.jwtExpires;
    process.env.LOG_LEVEL = setupData.logLevel;
  }

  function actAndAssert(result: Outcome) {
    let failed = false;
    try {
      initConfig();
    } catch (e) {
      failed = true;
      if (result === Outcome.WARN) {
        expect(e).to.be.instanceof(InitWarning);
      } else {
        expect(result).to.eq(Outcome.ERROR, 'should not have failed');
      }
    }

    if (!failed) {
      expect(result).to.eq(Outcome.PASS, 'should not have passed');
    }
  }

});
