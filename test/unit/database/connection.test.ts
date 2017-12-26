import { createSandbox, SinonStub, assert } from 'sinon';
import { expect } from 'chai';

import logger from '@/utilities/modules/logger';
import database, { execute, connect } from '@/database/connection';

const sandbox = createSandbox();

describe('database connection', function () {
  let logError: SinonStub = null;

  afterEach(() => sandbox.restore());

  beforeEach(function () {
    logError = sandbox.stub(logger, 'error');
  });

  describe('connect & database functions', function () {

    interface DbMock {
      raw: SinonStub;
    }

    let knexStub: SinonStub = null;
    let dbMock: DbMock = null;

    beforeEach(function () {
      knexStub = sandbox.stub();
      dbMock = {
        raw: sandbox.stub(),
      };
    });

    /*********************************** Tests ************************************/

    describe('connect', function () {

      it('should return es6 promise', function () {
        // Arrange
        makeKnexSuccessful();
        makeRawSuccessful();

        // Act
        const result = callConnect();

        // Assert
        expect(result).to.be.instanceof(Promise);
      });

      it('should connect successfully', async function () {
        // Arrange
        makeKnexSuccessful();
        makeRawSuccessful();

        // Act
        await callConnect();
      });

      it('should throw error if connection is not made', async function () {
        // Arrange
        makeKnexSuccessful();
        makeRawFail();

        // Act
        let fail = false;
        try {
          await callConnect();
        } catch (e) {
          fail = true;
        }

        // Assert
        expect(fail).to.eq(true, 'should have failed');
      });
    });

    describe('database', function () {

      it('should throw error if db not initialized', function () {
        // Act
        let failed = false;
        try {
          database();
        } catch (e) {
          failed = true;
        }

        // Assert
        expect(failed).to.eq(true, 'should have failed');
      });

      it('should return db if connection made successfully', function () {
        // Arrange
        makeKnexSuccessful();
        makeRawSuccessful();
        callConnect();

        // Act
        const db = database();

        // Assert
        expect(db).to.eq(dbMock);
      });
    });

    /****************************** Helper Functions ******************************/

    async function callConnect() {
      return connect(knexStub as any);
    }

    function makeKnexSuccessful() {
      knexStub.returns(dbMock);
    }

    function makeRawSuccessful() {
      dbMock.raw.resolves({});
    }

    function makeRawFail() {
      dbMock.raw.rejects();
    }
  });

  describe('execute function', function () {
    const ERROR_STRING = 'password error';
    const RESOLVE_STRING = 'resolved';

    it('should return an es6 Promise', function () {
      // Arrange
      const qb = createQb(true);

      // Act
      const result = execute(qb as any);

      // Assert
      assert.notCalled(logError);
      expect(result).to.be.instanceof(Promise);
    });

    it('should resolve thenable', async function () {
      // Arrange
      const qb = createQb(true);

      // Act
      const result = await execute(qb as any);

      // Assert
      assert.notCalled(logError);
      expect(result).to.eq(RESOLVE_STRING);
    });

    it('should be able to catch errors', async function () {
      // Arrange
      const qb = createQb(false);

      // Act
      let error = null;
      try {
        await execute(qb as any);
      } catch (e) {
        error = e;
      }

      // Assert
      expect(error).to.eq(ERROR_STRING);
    });

    it('should log any errors', async function () {
      // Arrange
      const qb = createQb(false);

      // Act
      try {
        await execute(qb as any);
      } catch (e) {
        // Do nothing
      }

      // Assert
      assert.called(logError);
    });

    /************************* Helper Functions *************************/

    function createQb(resolve: boolean) {
      return {
        // tslint:disable-next-line:completed-docs
        then(fn: (arg: any) => any) {
          const result = fn(RESOLVE_STRING);
          return {
            then: resolve ? (innerFn: Function) => innerFn(result) : () => { throw ERROR_STRING; },
          };
        },
      };
    }
  });

});
