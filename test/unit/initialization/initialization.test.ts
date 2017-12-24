import { createSandbox, SinonStub, assert } from 'sinon';
import { expect } from 'chai';

import * as Logger from '@/initialization/logger';
import * as Config from '@/initialization/config';
import * as Express from '@/initialization/express';
import * as Database from '@/initialization/database';
import { init } from '@/initialization';

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

  it('should initialize all successfully', function () {
    test({
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

  it('should initialize others if config fails', function () {
    test({
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

  it('should initialize others if database fails', function () {
    test({
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

  it('should throw error if logger fails', function () {
    test({
      config: {
        result: Result.PASS,
        called: true,
      },
      database: {
        result: Result.RESOLVE,
        called: true,
      },
      logger: {
        result: Result.FAIL,
        called: true,
      },
      express: {
        result: Result.PASS,
        called: true,
      },
      fails: false,
    });
  });

  it('should throw error if express fails', function () {
    test({
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
      fails: false,
    });
  });

  function test(testData: TestData) {
    // Arrange
    const stubs = {
      config: sandbox.stub(Config, 'initConfig'),
      database: sandbox.stub(Database, 'initDatabase'),
      logger: sandbox.stub(Logger, 'initLogger'),
      express: sandbox.stub(Express, 'initExpress'),
    };

    Object.keys(testData).map((key) => {
      const val = (testData as any)[key];
      const stub = (stubs as any)[key] as SinonStub;

      if (val.result === Result.RESOLVE) {
        stub.resolves();
      } else if (val.result === Result.REJECT) {
        stub.rejects();
      } else if (val.result === Result.PASS) {
        stub.returns({});
      } else if (val.result === Result.FAIL) {
        stub.throwsException();
      } else {
        expect.fail(`No such result: ${val.result}`);
      }
    });

    // Act
    try {
      init();
      expect(testData.fails).to.be.true;
    } catch (e) {
      expect(testData.fails).to.be.false;
      expect(e).to.be.of('InitWarning');
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

  /********************* Helper Functions ***********************/

});
