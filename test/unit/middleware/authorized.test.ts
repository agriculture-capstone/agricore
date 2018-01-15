import { createSandbox, assert } from 'sinon';
import { expect } from 'chai';

import authorizedMiddleware from '@/middleware/authorized';
import { ResponseStub } from 'test/tools/ResponseStub';

const sandbox = createSandbox();

describe('authorized middleware', function () {
  /** Test UserType's */
  enum Type {
    FIRST = 'first',
    SECOND = 'second',
    THIRD = 'third',
    FOURTH = 'fourth',
  }

  interface TestData {
    userType: Type;
    success: boolean;
  }

  const TYPES = [
    Type.FIRST,
    Type.SECOND,
    Type.THIRD,
  ];
  const UNAUTHORIZED_CODE = 403;

  afterEach(() => sandbox.restore());

  it('should succeed with type 1', function () {
    test({
      userType: Type.FIRST,
      success: true,
    });
  });

  it('should succeed with type 2', function () {
    test({
      userType: Type.SECOND,
      success: true,
    });
  });

  it('should succeed with type 3', function () {
    test({
      userType: Type.THIRD,
      success: true,
    });
  });

  it('should fail with type 4', function () {
    test({
      userType: Type.FOURTH,
      success: false,
    });
  });

  function test({ userType, success }: TestData) {
    // Arrange
    const next = sandbox.stub();
    const handler = authorizedMiddleware(...TYPES as any[]);
    const res = new ResponseStub(sandbox);
    const req = {
      user: {
        type: userType,
      },
    };

    // Act
    handler(req as any, res as any, next);

    // Assert
    if (success) {
      assert.calledOnce(next);
      expect(res.anyCalled()).to.be.false;
    } else {
      assert.notCalled(next);
      assert.calledOnce(res.end);
      assert.calledWith(res.sendStatus, UNAUTHORIZED_CODE);
    }
  }
});
