(function () {
  // Require all of the files ending with '.test' in this directory and all subdirectories
  const unitTests = require.context('.', true, /.test$/);
  unitTests.keys().forEach(unitTests);
}());
