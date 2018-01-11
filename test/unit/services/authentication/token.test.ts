import { expect } from 'chai';
import * as jwt from 'jsonwebtoken';
import { createSandbox } from 'sinon';

import { createToken } from '@/services/authentication/token';
import { UserType } from '@/models/User/UserType';
import { numSubstrings } from '@/utilities/functions/numSubstrings';

const sandbox = createSandbox();

describe('authentication service token module', function () {
  const VALID_USER_TYPE = UserType.BASIC;
  const VALID_USERNAME = 'username';
  const JWT_ISSUER = 'issuer';
  const JWT_AUDIENCE = 'audience';
  const JWT_EXPIRES = '7403';

  let circleObject: any;

  afterEach(() => sandbox.restore());

  before(function () {
    circleObject = {};
    circleObject.circleObject = circleObject;
  });

  beforeEach(function () {
    process.env.JWT_ISSUER = undefined;
    process.env.JWT_AUDIENCE = undefined;
    process.env.JWT_EXPIRES = undefined;
  });

  describe('should generate token', function () {
    const EXPECTED_PERIODS = 2;

    it('that is encrypted', async function () {
      const token = await createToken(VALID_USERNAME, VALID_USER_TYPE);
      expect(token).to.be.a('string');
      expect(numSubstrings(token, '.')).to.eq(EXPECTED_PERIODS);
    });

    it('that has user payload', async function () {
      const token = await createToken(VALID_USERNAME, VALID_USER_TYPE);
      return new Promise((resolve, reject) => {
        jwt.verify(token, process.env.JWT_SECRET, {}, (err, payload) => {
          err && reject(err);

          expect((payload as any).username).to.eq(VALID_USERNAME);
          expect((payload as any).type).to.eq(VALID_USER_TYPE);
          resolve();
        });
      });
    });

    it('that has environment options', async function () {
      // Arrange
      const signStub = sandbox.stub(jwt, 'sign');
      process.env.JWT_ISSUER = JWT_ISSUER;
      process.env.JWT_AUDIENCE = JWT_AUDIENCE;
      process.env.JWT_EXPIRES = JWT_EXPIRES;
      const optionsArgIndex = 2;

      // Act
      const tokenPromise = createToken(VALID_USERNAME, VALID_USER_TYPE);
      signStub.invokeCallback(false, {});
      await tokenPromise;

      // Assert
      const options = signStub.getCall(0).args[optionsArgIndex];
      expect(options.issuer).to.eq(JWT_ISSUER);
      expect(options.audience).to.eq(JWT_AUDIENCE);
      expect(options.expiresIn).to.eq(JWT_EXPIRES);
    });
  });

  describe('should fail to generate token', function () {
    const EMPTY_USERNAME = '';
    const INVALID_USERNAME = undefined as string;
    const INVALID_USER_TYPE = undefined as UserType;

    it('when empty username is provided', async function () {
      return test(EMPTY_USERNAME, VALID_USER_TYPE);
    });

    it('when no username is provided', async function () {
      return test(INVALID_USERNAME, VALID_USER_TYPE);
    });

    it('when no type is provided', async function () {
      return test(VALID_USERNAME, INVALID_USER_TYPE);
    });

    it('when argument cannot be serialized', async function () {
      return test(circleObject, VALID_USER_TYPE);
    });

    async function test(username: string, type: UserType) {
      try {
        await createToken(username, type);
      } catch (err) {
        return;
      }
      expect.fail('Should have failed to create token');
    }
  });
});
