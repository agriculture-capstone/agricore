import { reset as loggerReset } from '@/utilities/modules/logger';
import { reset as dbReset } from '@/database/connection';

let envBackup: typeof process.env = null;

before(function () {
  envBackup = Object.assign({}, process.env);
});

beforeEach(function () {
  process.env = Object.assign({}, envBackup);
  loggerReset();
  dbReset();
});
