import { expect } from 'chai';
import { verify } from 'jsonwebtoken';

import { createToken } from '@/services/authentication/token';
import { UserType } from '@/models/User/UserType';
import { numSubstrings } from '@/utilities/functions/numSubstrings';

describe('authentication service token module', function () {
  const VALID_USER_TYPE = UserType.BASIC;
  const VALID_USERNAME = 'username';

  let circleObject: any;

  before(function () {
    circleObject = {};
    circleObject.circleObject = circleObject;
  });

  describe('should generate token', function () {
    const EXPECTED_PERIODS = 2;

    it('that is encrypted', async function () {
      const token = await createToken(VALID_USERNAME, VALID_USER_TYPE);
      expect(token).to.be.a('string');
      expect(numSubstrings(token, '.')).to.be.eq(EXPECTED_PERIODS);
    });

    it('that has user payload', async function () {
      const token = await createToken(VALID_USERNAME, VALID_USER_TYPE);
      return new Promise((resolve, reject) => {
        verify(token, process.env.JWT_SECRET, {}, (err, payload) => {
          err && reject(err);

          expect((payload as any).username).to.be.eq(VALID_USERNAME);
          expect((payload as any).type).to.be.eq(VALID_USER_TYPE);
          resolve();
        });
      });
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
        const token = await createToken(username, type);
      } catch (err) {
        return;
      }
      throw new Error('Should have failed to create token');
    }
  });
});
