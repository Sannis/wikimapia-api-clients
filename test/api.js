/*!
 * Copyright by Oleg Efimov
 *
 * See license text in LICENSE file
 */

var Wikimapia = require('../lib/wikimapia');

exports.New = function (test) {
  test.expect(1);

  var api = new Wikimapia();

  test.ok(api instanceof Wikimapia);

  test.done();
};

exports.BadKey = function (test) {
  test.expect(1);

  var api = new Wikimapia({
    key: ''
  });

  api.getObject(55, function (err, json) {
    test.same(json, {
      debug: [ {
        code: 1000,
        message: 'Invalid key'
      } ]
    });
    
    test.done();
  });
};