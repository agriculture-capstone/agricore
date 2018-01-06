import { createSandbox, SinonStub, assert } from 'sinon';
import { ErrorRequestHandler } from 'express';
import { UnauthorizedError } from 'express-jwt';
import { expect } from 'chai';

import unauthorized from '@/middleware/unauthorized';
import { ResponseStub } from '../../tools/ResponseStub';

const sandbox = createSandbox();

describe('unauthorized middleware', function () {

  const UNAUTHORIZED_CODE = 403;

  let handler: ErrorRequestHandler = null;
  let err: Error = null;
  let res: ResponseStub = null;
  let req: SinonStub = null;
  let next: SinonStub = null;

  afterEach(() => sandbox.restore());

  beforeEach(function () {
    handler = unauthorized();
    next = sandbox.stub();
    req = sandbox.stub();
    res = new ResponseStub(sandbox);
  });

  describe('unauthorized error thrown', function () {

    beforeEach(function () {
      err = new (UnauthorizedError as any)(UNAUTHORIZED_CODE, new Error());
    });

    it('should end the response', function () {
      act();

      // Assert
      assert.calledOnce(res.end);
    });

    it('should deliver unauthorized status', function () {
      act();

      // Assert
      assert.calledWith(res.status, UNAUTHORIZED_CODE);
    });
  });

  describe('generic error thrown', function () {

    beforeEach(function () {
      err = new Error();
    });

    it('should call next', function () {
      act();

      // Assert
      assert.calledOnce(next);
      expect(res.anyCalled()).to.be.false;
    });
  });

  function act() {
    handler(err, req as any, res as any, next);
  }

});
