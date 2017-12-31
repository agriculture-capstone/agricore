import { expect } from 'chai';
import { createSandbox, SinonStub } from 'sinon';
import * as winston from 'winston';

import logger from '@/utilities/modules/logger';
import levels from '@/utilities/modules/logger/levels';
import { initLogger } from '@/initialization/logger';
import { Logger } from '@/models/logger';

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

      let loggerConstructor: SinonStub = null;
      let logMock: SinonStub = null;
      let loggers: Logger = null;

      beforeEach(function () {
        logMock = sandbox.stub();
        loggerConstructor = sandbox.stub(winston, 'Logger').returns({
          log: logMock,
        });
        initLogger();
        loggers = levels.map(({ name }) => {
          return { [name]: sandbox.stub(logger, name) };
        }).reduce((a, b) => {
          return {
            ...a,
            ...b,
          };
        }) as any;
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
      });

      if (name !== 'error') {
        it(`calling '${name}' should log array of strings`, function () {
          // Arrange
          const arr = [
            FAKE_MSG,
            FAKE_MSG,
          ];

          // Act
          (logger as any)[name](arr);

          // Assert
        });

        it(`'${name}' should log string`, function () {

        });
      }
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
