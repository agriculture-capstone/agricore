import { expect } from 'chai';
import { createSandbox, assert, SinonStub } from 'sinon';
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
  [k: string]: SinonStub;
  findUser: SinonStub;
  createToken: SinonStub;
  checkPassword: SinonStub;
}

const sandbox = createSandbox();

describe('authentication service authenticate module', function () {
  const USERNAME = 'username';
  const SIMPLE_PASSWORD = 'simplepassword';
  const COMPLEX_PASSWORD = '_C0MP|3><?';
  const SIMPLE_HASH = '$2a$11$mkIzes44pQ96o/l/lEUhJewwAGhiQva3HC2lTelnx6NlcKP2LPnu2';
  const COMPLEX_HASH = '$2a$11$xNyDJJcxz5Xu.J3V6CRS6uxqbt1oTKp.sGeToI9WqwLluaAKIXnia';
  const USER_ID = 1;

  let mockObjects: MockObjects;
  let mockFunctions: MockFunctions;

  // Reset the sandbox
  afterEach(() => sandbox.restore());

  beforeEach(function () {
    // Define the mocked objects
    mockObjects = {
      fakeToken: 'myVeryFakeToken',
    };

    // Define the mocked functions
    mockFunctions = {
      findUser: sandbox.stub(UserDb, 'findUser'),
      createToken: sandbox.stub(TokenAuth, 'createToken'),
      checkPassword: sandbox.stub(PasswordAuth, 'checkPassword'),
    };

    mockFunctions.createToken.withArgs(USERNAME, UserType.BASIC).resolves(mockObjects.fakeToken);
    mockFunctions.checkPassword.withArgs(SIMPLE_PASSWORD, SIMPLE_HASH).resolves(true);
    mockFunctions.checkPassword.withArgs(COMPLEX_PASSWORD, COMPLEX_HASH).resolves(true);
  });

  describe('valid credentials', function () {

    it('should return token with simple password', async function () {
      return test(SIMPLE_PASSWORD, SIMPLE_HASH);
    });

    it('should return token with complex password', async function () {
      return test(COMPLEX_PASSWORD, COMPLEX_HASH);
    });

    async function test(password: string, hash: string) {
      setupUser(USERNAME, hash, UserType.BASIC);
      const token = await authenticate(USERNAME, password);
      expect(token).to.eq(mockObjects.fakeToken);
      assert.calledOnce(mockFunctions.findUser);
      assert.calledOnce(mockFunctions.createToken);
      assert.calledOnce(mockFunctions.checkPassword);
    }
  });

  describe('invalid credentials', function () {
    const BAD_PASSWORD = 'wrong_password';

    beforeEach(function () {
      mockFunctions.checkPassword.withArgs(USERNAME, BAD_PASSWORD).resolves(false);
    });

    it('should fail with simple password', async function () {
      setupUser(USERNAME, SIMPLE_HASH, UserType.BASIC);
      let token: string;
      try {
        token = await authenticate(USERNAME, BAD_PASSWORD);
      } catch (err) {
        assert.calledOnce(mockFunctions.checkPassword);
        assert.calledOnce(mockFunctions.findUser);
        assert.notCalled(mockFunctions.createToken);
        return;
      }
      expect.fail('Should not have authenticated user');
    });
  });

  function setupUser(username: string, hash: string, userType: UserType) {
    mockObjects.fakeUser = {
      username,
      hash,
      userType,
      userId: USER_ID,
    };

    mockFunctions.findUser.withArgs(username).resolves(mockObjects.fakeUser);
  }
});
