/*!
 * Copyright by Oleg Efimov
 *
 * See license text in LICENSE file
 */

var Async = require('async');

var Wikimapia = require('../lib/wikimapia');

exports.TestNew = function (test) {
  test.expect(1);

  var api = new Wikimapia();

  test.ok(api instanceof Wikimapia);

  test.done();
};

exports.TestBadKey = function (test) {
  test.expect(1);

  var api = new Wikimapia({
    key: ''
  });

  api.object(55, function (err, json) {
    if (err) {
      throw err;
    }

    test.same(json, {
      debug: [ {
        code: 1000,
        message: 'Invalid key'
      } ]
    });
    
    test.done();
  });
};

exports.Object = function (test) {
  test.expect(3);

  var api = new Wikimapia();
  var objectId = 55;
  var objectTitle = 'Eiffel Tower';
  var objectCountry = 'France';

  api.object(objectId, function (err, json) {
    if (err) {
      throw err;
    }

    test.equals(json.id, objectId);

    test.equals(json.title, objectTitle);

    test.equals(json.location.country, objectCountry);

    test.done();
  });
};

exports.Search = function (test) {
  test.expect(1);

  var api = new Wikimapia();
  var objectId = 55;
  var objectTitle = 'Eiffel Tower';
  var objectCountry = 'France';

  var founded = false;
  var page = 1;
  
  Async.until(
    function () {
      return founded || (page > 5);
    },
    function (cb) {
      api.search(objectTitle, page, function (err, json) {
        if (err) {
          throw err;
        }

        founded = json.folder.some(function (object) {
          return (object.id == objectId) && (object.name == objectTitle) && (object.location.country == objectCountry);
        });

        page++;

        cb();
      });
    },
    function (err) {
      if (err) {
        throw err;
      }
      test.ok(founded);
      test.done();
    }
  );
};
