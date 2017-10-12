import { expect } from 'chai';
import * as td from 'testdouble';
import * as path from 'path';

import { authenticate } from '@/services/authentication/authenticate';
import * as UserDb from '@/database/User';
import * as TokenAuth from '@/services/authentication/token';
import * as PasswordAuth from '@/services/authentication/password';
import { DatabaseUser } from '@/models/User';
import { UserType } from '@/models/User/UserType';

interface MockObjects {
  fakeUser?: DatabaseUser;
  fakeToken: string;
}

interface MockFunctions {
  findUser: typeof UserDb.findUser;
  createToken: typeof TokenAuth.createToken;
  checkPassword: typeof PasswordAuth.checkPassword;
}

describe('authentication service authenticate module', function () {
  const USERNAME = 'username';
  const SIMPLE_PASSWORD = 'simplepassword';
  const COMPLEX_PASSWORD = '_C0MP|3><?';
  const SIMPLE_HASH = '$2a$11$mkIzes44pQ96o/l/lEUhJewwAGhiQva3HC2lTelnx6NlcKP2LPnu2';
  const COMPLEX_HASH = '$2a$11$xNyDJJcxz5Xu.J3V6CRS6uxqbt1oTKp.sGeToI9WqwLluaAKIXnia';
  const USER_ID = 1;

  let mockObjects: MockObjects;
  let mockFunctions: MockFunctions;

  beforeEach(function () {
    // Define the mocked objects
    mockObjects = {
      fakeToken: 'myVeryFakeToken',
    };

    // Define the mocked functions
    mockFunctions = {
      findUser: td.replace(UserDb, 'findUser'),
      createToken: td.replace(TokenAuth, 'createToken'),
      checkPassword: td.replace(PasswordAuth, 'checkPassword'),
    };

    td.when(mockFunctions.createToken(USERNAME, UserType.BASIC)).thenResolve(mockObjects.fakeToken);
    td.when(mockFunctions.checkPassword(SIMPLE_PASSWORD, SIMPLE_HASH)).thenResolve(true);
    td.when(mockFunctions.checkPassword(COMPLEX_PASSWORD, COMPLEX_HASH)).thenResolve(true);
  });

  describe('should successfully authenticate and return token', function () {

    it('with simple password', async function () {
      return test(SIMPLE_PASSWORD, SIMPLE_HASH);
    });

    it('with complex password', async function () {
      return test(COMPLEX_PASSWORD, COMPLEX_HASH);
    });

    async function test(password: string, hash: string) {
      setupUser(USERNAME, hash, UserType.BASIC);
      const token = await authenticate(USERNAME, password);
      expect(token).to.be.eq(mockObjects.fakeToken);
    }
  });

  describe('should fail to authenticate', function () {
    const BAD_PASSWORD = 'wrong_password';

    beforeEach(function () {
      td.when(mockFunctions.checkPassword(USERNAME, BAD_PASSWORD)).thenResolve(false);
    });

    it('with simple password', async function () {
      setupUser(USERNAME, SIMPLE_HASH, UserType.BASIC);
      let token: string;
      try {
        token = await authenticate(USERNAME, BAD_PASSWORD);
      } catch (err) {
        return;
      }
      throw new Error('Should not have authenticated user');
    });
  });

  function setupUser(username: string, hash: string, userType: UserType) {
    mockObjects.fakeUser = {
      username,
      hash,
      userType,
      userId: USER_ID,
    };

    td.when(mockFunctions.findUser(username)).thenResolve(mockObjects.fakeUser);
  }
});
