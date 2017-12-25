import { createSandbox, SinonStub, assert } from 'sinon';
import { expect } from 'chai';

import * as LoggerInit from '@/initialization/logger';
import * as ConfigInit from '@/initialization/config';
import * as ExpressInit from '@/initialization/express';
import * as DatabaseInit from '@/initialization/database';
import logger from '@/utilities/modules/logger';
import { init } from '@/initialization';
import { InitWarning } from '@/errors/InitError';

const sandbox = createSandbox();

/** Possible results of mocked function */
enum Result { PASS = 1, ERROR, WARN, RESOLVE, REJECT_ERR, REJECT_WARN }

/** Result of act */
enum Outcome {
  PASS = 'pass',
  ERROR = 'error',
  WARN = 'warn',
}

interface TestStubs {
  config: SinonStub;
  database: SinonStub;
  logger: SinonStub;
  express: SinonStub;
  error: SinonStub;
  warn: SinonStub;
}

interface MockInfo {
  result: Result;
  called: boolean;
}

interface TestData {
  config: MockInfo;
  database: MockInfo;
  logger: MockInfo;
  express: MockInfo;
}

describe('application initialization', function () {
  let stubs: TestStubs;

  // Reset the sandbox
  afterEach(() => sandbox.restore());

  it('should initialize all successfully', async function () {
    return test({
      config: {
        result: Result.PASS,
        called: true,
      },
      database: {
        result: Result.RESOLVE,
        called: true,
      },
      logger: {
        result: Result.PASS,
        called: true,
      },
      express: {
        result: Result.PASS,
        called: true,
      },
    }, Outcome.PASS);
  });

  it('should fail if config fails', async function () {
    return test({
      config: {
        result: Result.ERROR,
        called: true,
      },
      database: {
        result: Result.RESOLVE,
        called: false,
      },
      logger: {
        result: Result.PASS,
        called: true,
      },
      express: {
        result: Result.PASS,
        called: false,
      },
    }, Outcome.ERROR);
  });

  it('should initialize others if config warns', async function () {
    return test({
      config: {
        result: Result.WARN,
        called: true,
      },
      database: {
        result: Result.RESOLVE,
        called: true,
      },
      logger: {
        result: Result.PASS,
        called: true,
      },
      express: {
        result: Result.PASS,
        called: true,
      },
    }, Outcome.WARN);
  });

  it('should throw error if logger errors', async function () {
    return test({
      config: {
        result: Result.PASS,
        called: true,
      },
      database: {
        result: Result.RESOLVE,
        called: false,
      },
      logger: {
        result: Result.ERROR,
        called: true,
      },
      express: {
        result: Result.PASS,
        called: false,
      },
    }, Outcome.ERROR);
  });

  it('should throw error if logger warns', async function () {
    return test({
      config: {
        result: Result.PASS,
        called: true,
      },
      database: {
        result: Result.RESOLVE,
        called: false,
      },
      logger: {
        result: Result.WARN,
        called: true,
      },
      express: {
        result: Result.PASS,
        called: false,
      },
    }, Outcome.ERROR);
  });

  it('should initialize others if database warns', async function () {
    return test({
      config: {
        result: Result.PASS,
        called: true,
      },
      database: {
        result: Result.REJECT_WARN,
        called: true,
      },
      logger: {
        result: Result.PASS,
        called: true,
      },
      express: {
        result: Result.PASS,
        called: true,
      },
    }, Outcome.WARN);
  });

  it('should fail if database errors', async function () {
    return test({
      config: {
        result: Result.PASS,
        called: true,
      },
      database: {
        result: Result.REJECT_ERR,
        called: true,
      },
      logger: {
        result: Result.PASS,
        called: true,
      },
      express: {
        result: Result.PASS,
        called: false,
      },
    }, Outcome.ERROR);
  });

  it('should throw error if express fails', async function () {
    return test({
      config: {
        result: Result.PASS,
        called: true,
      },
      database: {
        result: Result.RESOLVE,
        called: true,
      },
      logger: {
        result: Result.PASS,
        called: true,
      },
      express: {
        result: Result.ERROR,
        called: true,
      },
    }, Outcome.ERROR);
  });

  it('should throw error if express warns', async function () {
    return test({
      config: {
        result: Result.PASS,
        called: true,
      },
      database: {
        result: Result.RESOLVE,
        called: true,
      },
      logger: {
        result: Result.PASS,
        called: true,
      },
      express: {
        result: Result.WARN,
        called: true,
      },
    }, Outcome.ERROR);
  });

  async function test(testData: TestData, outcome: Outcome) {
    // Arrange
    stubs = {
      config: sandbox.stub(ConfigInit, 'initConfig'),
      database: sandbox.stub(DatabaseInit, 'initDatabase'),
      logger: sandbox.stub(LoggerInit, 'initLogger'),
      express: sandbox.stub(ExpressInit, 'initExpress'),
      error: sandbox.stub(logger, 'error'),
      warn: sandbox.stub(logger, 'warn'),
    };

    stubs.error.throwsException(new Error('Should not be calling logger.error'));

    Object.keys(testData).map((key) => {
      const val = (testData as any)[key];
      const stub = (stubs as any)[key] as SinonStub;

      switch (val.result) {
        case Result.ERROR:
          stub.throws(new Error('mocked error'));
          break;

        case Result.PASS:
          stub.returns({});
          break;

        case Result.REJECT_ERR:
          stub.rejects(new Error('mocked error'));
          break;

        case Result.REJECT_WARN:
          stub.rejects(new InitWarning('mocked warning'));
          break;

        case Result.RESOLVE:
          stub.resolves();
          break;

        case Result.WARN:
          stub.throws(new InitWarning('mocked warning'));
          break;
      }
    });

    // Act & Assert
    let failed = false;
    try {
      await init();
    } catch (e) {
      failed = true;
      expect(outcome).to.eq(Outcome.ERROR);
    }
    if (!failed) {
      expect(outcome).not.to.eq(Outcome.ERROR);
    }
    if (outcome === Outcome.WARN) {
      assert.called(stubs.warn);
    }

    // Assert
    Object.keys(testData).map((key) => {
      const val = (testData as any)[key];
      const stub = (stubs as any)[key] as SinonStub;

      if (val.called) {
        assert.calledOnce(stub);
      } else {
        assert.notCalled(stub);
      }
    });
  }

});
