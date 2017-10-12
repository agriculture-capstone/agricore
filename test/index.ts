import * as path from 'path';
import * as td from 'testdouble';

// Setup config environment
import { config } from 'dotenv';
config({
  path: path.resolve(__dirname, 'test.env'),
});

// Reset any stubs
afterEach(function () {
  td.reset();
});

/** Unit Tests */
describe('@unit', function () {
  require('./unit');
});

/** Integration Tests */
describe('@integration', function () {
  require('./integration');
});
