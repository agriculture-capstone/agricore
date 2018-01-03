const path = require('path');

const ROOT = path.resolve(__dirname, '..')

/** Resolve file or directory in root */
exports.resolve = function resolve(dirOrFile) {
  return path.join(ROOT, dirOrFile)
}

exports.ROOT = ROOT;
