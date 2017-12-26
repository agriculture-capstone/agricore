let envBackup: typeof process.env = null;

before(function () {
  envBackup = Object.assign({}, process.env);
});

beforeEach(function () {
  process.env = Object.assign({}, envBackup);
});
