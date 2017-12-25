const path = require('path');

// Setup config environment
const { config } = require('dotenv');
config({
  path: path.resolve(__dirname, 'test.env'),
});
