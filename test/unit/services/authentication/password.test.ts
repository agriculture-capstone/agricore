import { expect } from 'chai';
import * as td from 'testdouble';
import * as bcrypt from 'bcrypt';

import { hashPassword, checkPassword, SALT_ROUNDS } from '@/services/authentication/password';
import { numSubstrings } from '@/utilities/functions/numSubstrings';

interface BcryptMock {
  hash: typeof bcrypt.hash;
  compare: typeof bcrypt.compare;
}

describe('authentication service password module', function () {
  const SIMPLE_PASSWORD = 'simplepassword';
  const COMPLEX_PASSWORD = '_C0MP|3><?';
  const MIN_SALT_ROUNDS = 10;

  let bcryptMock: BcryptMock;

  it('should have >=10 salt rounds', function () {
    expect(SALT_ROUNDS).to.be.at.least(MIN_SALT_ROUNDS);
  });

  describe('should hash', function () {
    const EXPECTED_DOLLARS = 3;

    describe('without bcrypt', function () {
      const fakeHash = '$2a$11$k8yDJJcxz5Xu.JnV6CRS6uxqbt1ogHp.sYeToI9WqwLluaAKIXnia';

      beforeEach(function () {
        mockBcrypt();
      });

      it('simple password', async function () {
        td.when(bcryptMock.hash(SIMPLE_PASSWORD, SALT_ROUNDS), { times: 1 }).thenResolve(fakeHash);
        return test(SIMPLE_PASSWORD);
      });

      it('complex password', async function () {
        td.when(bcryptMock.hash(COMPLEX_PASSWORD, SALT_ROUNDS), { times: 1 }).thenResolve(fakeHash);
        return test(COMPLEX_PASSWORD);
      });
    });

    describe('with bcrypt @slow',function () {
      it('simple password', async function () {
        return test(SIMPLE_PASSWORD);
      });

      it('complex password', async function () {
        return test(COMPLEX_PASSWORD);
      });
    });

    async function test(password: string) {
      const hash = await hashPassword(password);
      expect(hash).to.be.a('string');
      expect(hash).to.not.be.equal(password);
      expect(numSubstrings(hash, '$')).to.be.equal(EXPECTED_DOLLARS);
    }
  });

  describe('should compare', function () {
    const SIMPLE_HASH = '$2a$11$mkIzes44pQ96o/l/lEUhJewwAGhiQva3HC2lTelnx6NlcKP2LPnu2';
    const COMPLEX_HASH = '$2a$11$xNyDJJcxz5Xu.J3V6CRS6uxqbt1oTKp.sGeToI9WqwLluaAKIXnia';
    const INCORRECT_HASH = '$2a$11$yNyDJJcxz5Xu.JnV6CRS6uxqbt1oTKp.sgeToI9WqwLluaAKIXnia';

    describe('without bcrypt', function () {
      beforeEach(function () {
        mockBcrypt();
      });

      it('simple password', async function () {
        td.when(bcryptMock.compare(SIMPLE_PASSWORD, SIMPLE_HASH), { times: 1 }).thenResolve(true);
        return test(SIMPLE_PASSWORD, SIMPLE_HASH, true);
      });

      it('complex password', async function () {
        td.when(bcryptMock.compare(COMPLEX_PASSWORD, COMPLEX_HASH), { times: 1 }).thenResolve(true);
        return test(COMPLEX_PASSWORD, COMPLEX_HASH, true);
      });
    });

    describe('with bcrypt @slow', function () {
      it('simple password', async function () {
        return test(SIMPLE_PASSWORD, SIMPLE_HASH, true);
      });

      it('complex password', async function () {
        return test(COMPLEX_PASSWORD, COMPLEX_HASH, true);
      });

      it('incorrect password', async function () {
        return test(SIMPLE_PASSWORD, INCORRECT_HASH, false);
      });
    });

    async function test(password: string, hash: string, expected: boolean) {
      const isPassword = await checkPassword(password, hash);
      expect(isPassword).to.be.eq(expected);
    }
  });

  function mockBcrypt() {
    bcryptMock = {
      compare: td.replace(bcrypt, 'compare'),
      hash: td.replace(bcrypt, 'hash'),
    };
  }
});
