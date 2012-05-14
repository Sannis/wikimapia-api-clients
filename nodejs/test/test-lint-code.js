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
    './node_modules/.bin/nodelint',
    ['./lib/', './test/'],
    {
      stdout: '0 errors\n',
      stderr: '',
      exitCode: 0
    },
    test
  );
};
