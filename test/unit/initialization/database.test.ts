import { createSandbox, SinonStub, assert } from 'sinon';
import { expect } from 'chai';

import * as database from '@/database/connection';
import { initDatabase } from '@/initialization/database';
import { InitError } from '@/errors/InitError';

const sandbox = createSandbox();

interface TestStubs {
  connect: SinonStub;
}

describe('database initialization', function () {
  let stubs: TestStubs = null;

  afterEach(() => sandbox.restore());

  beforeEach(function () {
    stubs = {
      connect: sandbox.stub(database, 'connect'),
    };
  });

  it('should connect successfully', async function () {
    // Arrange
    stubs.connect.resolves();

    // Act
    await initDatabase();

    // Assert
    assert.calledOnce(stubs.connect);
  });

  it('should throw InitError on failure', async function () {
    // Arrange
    stubs.connect.rejects();
    let failed = false;

    // Act
    try {
      await initDatabase();
    } catch (e) {
      failed = true;
      expect(e).to.be.instanceof(InitError);
    }

    // Assert
    assert.calledOnce(stubs.connect);
    expect(failed).to.be.true;
  });

});
