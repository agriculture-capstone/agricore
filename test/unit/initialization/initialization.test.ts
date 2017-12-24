import { createSandbox, SinonStub, assert } from 'sinon';
import { expect } from 'chai';

import * as LoggerInit from '@/initialization/logger';
import * as ConfigInit from '@/initialization/config';
import * as ExpressInit from '@/initialization/express';
import * as DatabaseInit from '@/initialization/database';
import logger from '@/utilities/modules/logger';
import { init } from '@/initialization';
import { InitError } from '@/errors/InitError';

const sandbox = createSandbox();

describe('application initialization', function () {

  /** Possible results of mocked function */
  enum Result { PASS = 1, FAIL, RESOLVE, REJECT }

  interface MockInfo {
    result: Result;
    called: boolean;
  }

  interface TestData {
    config: MockInfo;
    database: MockInfo;
    logger: MockInfo;
    express: MockInfo;
    fails: boolean;
  }

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
      fails: false,
    });
  });

  it('should initialize others if config fails', async function () {
    return test({
      config: {
        result: Result.FAIL,
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
      fails: false,
    });
  });

  it('should initialize others if database fails', async function () {
    return test({
      config: {
        result: Result.PASS,
        called: true,
      },
      database: {
        result: Result.REJECT,
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
      fails: false,
    });
  });

  it('should throw error if logger fails', async function () {
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
        result: Result.FAIL,
        called: true,
      },
      express: {
        result: Result.PASS,
        called: false,
      },
      fails: true,
    });
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
        result: Result.FAIL,
        called: true,
      },
      fails: true,
    });
  });

  async function test(testData: TestData) {
    // Arrange
    const getKeys = () => Object.keys(testData).filter(key => key !== 'fails');

    const stubs = {
      config: sandbox.stub(ConfigInit, 'initConfig'),
      database: sandbox.stub(DatabaseInit, 'initDatabase'),
      logger: sandbox.stub(LoggerInit, 'initLogger'),
      express: sandbox.stub(ExpressInit, 'initExpress'),
      loggerErr: sandbox.stub(logger, 'error'),
      loggerWarn: sandbox.stub(logger, 'warn'),
    };

    stubs.loggerErr.throwsException(new Error('Should not be calling logger.error'));

    getKeys().map((key) => {
      const val = (testData as any)[key];
      const stub = (stubs as any)[key] as SinonStub;

      if (val.result === Result.RESOLVE) {
        stub.resolves();
      } else if (val.result === Result.REJECT) {
        stub.rejects(new InitError('Mocked InitError'));
      } else if (val.result === Result.PASS) {
        stub.returns({});
      } else if (val.result === Result.FAIL) {
        stub.throws(new InitError('Mocked InitError'));
      } else {
        expect.fail(`No such result: ${val.result}`);
      }
    });

    // Act
    let failed = false;
    try {
      await init();
    } catch (e) {
      failed = true;
      expect(testData.fails).to.be.eq(true, `should not have failed\nerror: ${e}`);
      expect(e).to.be.an.instanceof(InitError);
    }
    if (!failed) {
      expect(testData.fails).to.be.eq(false, 'should have failed');
    }

    // Assert
    getKeys().map((key) => {
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
