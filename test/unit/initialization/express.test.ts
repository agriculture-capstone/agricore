import { createSandbox, SinonStub, assert } from 'sinon';
import { expect } from 'chai';

import { initExpress, DEFAULT_PORT } from '@/initialization/express';
import middleware from '@/middleware';

const sandbox = createSandbox();

interface TestStubs {
  express: SinonStub;
  middlewareApply: SinonStub;
  serverUse: SinonStub;
}

describe('express initialization', function () {

  let stubs: TestStubs = null;

  afterEach(() => sandbox.restore());

  beforeEach(function () {
    stubs = {
      express: sandbox.stub(),
      middlewareApply: sandbox.stub(<any>middleware, 'apply'),
      serverUse: sandbox.stub(),
    };

    const serverStub = { use: stubs.serverUse };
    stubs.express.returns(serverStub);
  });

  it('should initialize successfully', function () {
    // Act
    const { port } = initExpress(stubs.express);

    // Assert
    assert.calledOnce(stubs.express);
    assert.calledOnce(stubs.middlewareApply);
    assert.calledOnce(stubs.serverUse);
    expect(port).to.be.eq(DEFAULT_PORT);
  });

});
