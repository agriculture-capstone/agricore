import { createSandbox } from 'sinon';

import jwtMiddleware from '@/middleware/jwt';

const sandbox = createSandbox();

describe('jwt middleware', function () {

  afterEach(() => sandbox.restore());

  it('should create event handler successfully', function () {
    jwtMiddleware();
  });
});
