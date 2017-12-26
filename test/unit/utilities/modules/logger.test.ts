import { expect } from 'chai';
import { createSandbox, SinonStub } from 'sinon';
import * as winston from 'winston';

import logger from '@/utilities/modules/logger';
import levels from '@/utilities/modules/logger/levels';
import { initLogger } from '@/initialization/logger';

const sandbox = createSandbox();

describe('logger utility', function () {
  const FAKE_MSG = 'my_fake_msg';

  afterEach(() => sandbox.restore());

  describe('loggers', function () {

    describe('before initialization', function () {

      levels.map(({ name }) => {
        it(`'${name}' logger should throw error`, function () {
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
      const FILE_RETURN = 'file_return';
      const CONSOLE_RETURN = 'console_return';

      let loggerConstructor: SinonStub = null;
      let logMock: SinonStub = null;
      let fileStub: SinonStub = null;
      let consoleStub: SinonStub = null;

      beforeEach(function () {
        logMock = sandbox.stub();
        loggerConstructor = sandbox.stub(winston, 'Logger').returns({
          log: logMock,
        });
        fileStub = sandbox.stub(winston.transports, 'File').returns(FILE_RETURN);
        consoleStub = sandbox.stub(winston.transports, 'Console').returns(CONSOLE_RETURN);

        initLogger();
      });

      levels.map(({ name, handleExceptions }, i) => {
        it(`'${name}' logger should initialize properly`, function () {
          // Arrange
          const fileRegex = /$(C:\/|\/).*\.log/;
          const loggerCalled = loggerConstructor.getCall(i).args[0];
          const fileCalled = fileStub.getCall(i).args[0];
          const consoleCalled = consoleStub.getCall(i).args[0];

          // Assert
          expect(loggerCalled.transports).to.eq([FILE_RETURN, CONSOLE_RETURN]);
          expect(fileCalled.level).to.eq(name);
          expect(fileCalled.handleExceptions).to.eq(handleExceptions);
          expect(fileCalled.filename).matches(fileRegex);
          expect(consoleCalled.handleExceptions).to.eq(handleExceptions);
        });
      });
    });

  });

  describe('initLogger', function () {
    // Arrange

    // Act

    // Assert
  });

  describe('networkLogger', function () {
    // Arrange

    // Act

    // Assert
  });

  describe('init', function () {
    // Arrange

    // Act

    // Assert
  });

  /******************************* Helper Functions *******************************/
});
