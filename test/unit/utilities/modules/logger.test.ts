import { expect } from 'chai';
import { createSandbox, SinonStub, assert } from 'sinon';
import * as winston from 'winston';

import logger, { createNetworkLogger } from '@/utilities/modules/logger';
import levels from '@/utilities/modules/logger/levels';
import { initLogger } from '@/initialization/logger';

const sandbox = createSandbox();

describe('logger utility', function () {
  const FAKE_MSG = 'my_fake_msg';

  afterEach(() => sandbox.restore());

  describe('loggers', function () {

    describe('before initialization', function () {

      levels.map(({ name }) => {
        it(`'${name}' should throw error`, function () {
          // Act
          let fail = false;
          try {
            logger[name](FAKE_MSG);
          } catch (e) {
            fail = true;
          }

          // Assert
          expect(fail).to.eq(true, 'should have failed');
        });
      });
    });

    describe('after initialization', function () {
      const STACK_INDEX = 0;

      let loggerConstructor: SinonStub = null;
      let logStub: SinonStub = null;

      beforeEach(function () {
        logStub = sandbox.stub();
        loggerConstructor = sandbox.stub(winston, 'Logger').returns({
          log: logStub,
        });
        process.env.LOG_LEVEL = 'silly';
        initLogger();
      });

      levels.map(({ name, handleExceptions }, i) => {

        it(`'${name}' should initialize properly`, function () {
          // Arrange
          let fileTransport: winston.FileTransportInstance = null;
          let consoleTranport: winston.ConsoleTransportInstance = null;
          const loggerCall = loggerConstructor.getCalls().find((call) => {
            const transports = call.args[0].transports;
            fileTransport = transports[0];
            consoleTranport = transports[1];

            return fileTransport.level === name;
          });

          // Assert
          expect(loggerCall).to.be.ok;
          expect(fileTransport.name).to.contain(name);
          expect(fileTransport.level).to.be.eq(name);
          expect(consoleTranport.level).to.be.eq(name);
        });

        if (name === 'error' || name === 'warn') {

          it(`calling '${name}' should log stack and multiple message strings`, function () {
            // Arrange
            const msgOffset = 1;
            const numMsgs = 2;

            // Act
            (logger as any)[name](FAKE_MSG, FAKE_MSG);

            // Assert
            const [calledLogger, calledMessage] = logStub.getCall(0).args;
            expect(calledLogger).to.eq(name);
            const messages = calledMessage.split(',');
            [...messages].splice(msgOffset, numMsgs).map(msg => expect(msg).to.eq(`"${FAKE_MSG}"`));
            expect(messages[STACK_INDEX]).to.contain('Error');
          });

          it(`calling '${name}' should log stack and string message`, function () {
            // Arrange
            const msgOffset = 1;
            const numMsgs = 1;

            // Act
            (logger as any)[name](FAKE_MSG);

            // Assert
            const [calledLogger, calledMessage] = logStub.getCall(0).args;
            expect(calledLogger).to.eq(name);
            const messages = calledMessage.split(',');
            [...messages].splice(msgOffset, numMsgs).map(msg => expect(msg).to.eq(`"${FAKE_MSG}"`));
            expect(messages[STACK_INDEX]).to.contain('Error');
          });

        } else {

          it(`calling '${name}' should log multiple messages strings`, function () {
            // Act
            (logger as any)[name](FAKE_MSG, FAKE_MSG);

            // Assert
            const [calledLogger, calledMessage] = logStub.getCall(0).args;
            expect(calledLogger).to.eq(name);
            expect(calledMessage).to.eq(`"${FAKE_MSG}","${FAKE_MSG}"`);
          });

          it(`'${name}' should log single message`, function () {
            // Act
            (logger as any)[name](FAKE_MSG);

            // Assert
            const [calledLogger, calledMessage] = logStub.getCall(0).args;
            expect(calledLogger).to.eq(name);
            expect(calledMessage).to.eq(`"${FAKE_MSG}"`);
          });
        }
      });
    });

  });

  describe('LOG_LEVEL filter', function () {

    interface TestData {
      logLevel: string;
      filtered: boolean;
      loggerType?: string;
    }

    it('info should be filtered by LOG_LEVEL=error', function () {
      test({
        logLevel: 'error',
        filtered: true,
      });
    });

    it('info should be filtered by LOG_LEVEL=debug', function () {
      test({
        logLevel: 'warn',
        filtered: true,
      });
    });

    it('info should not be filtered by LOG_LEVEL=info', function () {
      test({
        logLevel: 'info',
        filtered: false,
      });
    });

    it('info should not be filtered by LOG_LEVEL=silly', function () {
      test({
        logLevel: 'silly',
        filtered: false,
      });
    });

    it('warn should be filtered by LOG_LEVEL=error', function () {
      test({
        logLevel: 'error',
        loggerType: 'warn',
        filtered: true,
      });
    });

    function test({ filtered, logLevel, loggerType }: TestData) {
      // Arrange
      const type = loggerType || 'info';
      const logStub = sandbox.stub();
      sandbox.stub(winston, 'Logger').returns({
        log: logStub,
      });
      process.env.LOG_LEVEL = logLevel;
      initLogger();

      // Act
      (logger as any)[type](FAKE_MSG);

      // Assert
      if (filtered) {
        assert.notCalled(logStub);
      } else {
        assert.called(logStub);
      }
    }
  });

  describe('createNetworkLogger', function () {
    let morganStub: SinonStub = null;
    let logStub: SinonStub = null;

    beforeEach(function () {
      morganStub = sandbox.stub();
      logStub = sandbox.stub();
      sandbox.stub(winston, 'Logger').returns({
        log: logStub,
      });
      initLogger();
    });

    it('should successfully create network logger using info logger', function () {
      // Act
      createNetworkLogger(morganStub as any);
      const options = morganStub.getCall(0).args[1];
      options.stream.write(FAKE_MSG);

      // Assert
      assert.calledWith(logStub, 'info', FAKE_MSG);
    });

    it('should succeed in creating morgan network logger', function () {
      // Act
      createNetworkLogger();
    });
  });

  describe('init', function () {

    it('should throw error if init called twice', function () {
      // Arrange
      initLogger();

      // Act
      let failed = false;
      try {
        initLogger();
      } catch (err) {
        failed = true;
      }

      // Assert
      expect(failed).to.eq(true, 'Should have failed');
    });
  });

  /******************************* Helper Functions *******************************/
});
