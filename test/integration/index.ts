
(function () {
  // Require all of the files ending with '.test' in this directory and all subdirectories
  const integrationTests = require.context('.', true, /.test$/);
  integrationTests.keys().forEach(integrationTests);
}());
