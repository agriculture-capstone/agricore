import { createSandbox, SinonStub, assert } from 'sinon';

import { initLogger } from '@/initialization/logger';
import * as logger from '@/utilities/modules/logger';

const sandbox = createSandbox();

interface TestStubs {
  loggerInit: SinonStub;
}

describe('logger initialization', function () {

  let stubs: TestStubs = null;

  afterEach(() => sandbox.restore());

  beforeEach(function () {
    stubs = {
      loggerInit: sandbox.stub(logger, 'init'),
    };
  });

  it('should successfully initialize', function () {
    // Act
    initLogger();

    // Assert
    assert.calledOnce(stubs.loggerInit);
  });

});
