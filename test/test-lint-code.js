/*
 * Code style test
 */

/**
 * Module dependencies
 */
var helper = require('./helper');

/**
 * Lint own code
 *
 * @param test
 */
exports.MakeLint = function (test) {
  helper.testConsoleOutput(
    'make',
    ['lint'],
    {
      stdout: './node_modules/.bin/nodelint ./lib/ ./test/\n',
      stderr: '0 errors\n',
      exitCode: 0
    },
    test
  );
};
