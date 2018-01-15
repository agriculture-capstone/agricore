import { createSandbox, assert } from 'sinon';

import middleware from '@/middleware';

const sandbox = createSandbox();

describe('middleware root', function () {

  afterEach(() => sandbox.restore());

  it('should initialize successfully', function () {
    // Arrange
    const app = {
      use: sandbox.stub(),
    };

    // Act
    middleware.apply(app);

    // Assert
    assert.called(app.use);
  });
});
