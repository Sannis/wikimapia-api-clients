/*!
 * Copyright by Oleg Efimov
 *
 * See license text in LICENSE file
 */

window.testWikimapiaKey = 'F09D7CEF-C79C4691-E311E506-54999C19-73DF1B6C-DCBA00AC-B7CE2ABC-FED89F9B';

window.testWikimapiaObjectId = 55;
window.testWikimapiaObjectTileX = 33185;
window.testWikimapiaObjectTileY = 22545;
window.testWikimapiaObjectTileZ = 16;
window.testWikimapiaObjectTileC = 50;
window.testWikimapiaObjectTitle = 'Eiffel Tower';
window.testWikimapiaObjectCountry = 'France';

window.testWikimapiaAPI = {
  'TestNew': function (test) {
    test.expect(2);

    var api = null;

    test.doesNotThrow(function () {
      api = new Request.WikimapiaAPI();
    });

    test.ok(api instanceof Request.WikimapiaAPI);

    test.done();
  },
  'TestBadKey': function (test) {
    test.expect(1);

    var api = new Request.WikimapiaAPI({
      key: '',
      format: 'json',
      onSuccess: function(json){
        test.same(json, {
          debug: [ {
            code: 1000,
            message: 'Invalid key'
          } ]
        });

        test.done();
      }
    });

    api.getObjectById(window.testWikimapiaObjectId);
  },
  'Box': function (test) {
    test.expect(1);

    var api = new Request.WikimapiaAPI({
      key: window.testWikimapiaKey,
      format: 'json',
      onSuccess: function(json){
        var founded = json.folder.some(function (object) {
          return (object.id === window.testWikimapiaObjectId.toString())
              && (object.name === window.testWikimapiaObjectTitle);
        });

        test.ok(founded);

        test.done();
      }
    });

    api.getObjectsInBoxByTile(
      window.testWikimapiaObjectTileX,
      window.testWikimapiaObjectTileY,
      window.testWikimapiaObjectTileZ,
      window.testWikimapiaObjectTileC
    );
  },
  'Object': function (test) {
    test.expect(3);

    var api = new Request.WikimapiaAPI({
      key: window.testWikimapiaKey,
      format: 'json',
      onSuccess: function(json){
        test.equals(json.id, window.testWikimapiaObjectId);
        test.equals(json.title, window.testWikimapiaObjectTitle);
        test.equals(json.location.country, window.testWikimapiaObjectCountry);

        test.done();
      }
    });

    api.getObjectById(window.testWikimapiaObjectId);
  },
  'Search': function (test) {
    test.expect(1);

    var api = new Request.WikimapiaAPI({
      key: window.testWikimapiaKey,
      format: 'json'
    });

    var founded = false, page = 1;

    async.until(
      function () {
        return founded || (page > 5);
      },
      function (cb) {
        api.onSuccess = function (json) {
          founded = json.folder.some(function (object) {
            return (object.id === window.testWikimapiaObjectId)
                && (object.name === window.testWikimapiaObjectTitle)
                && (object.location.country === window.testWikimapiaObjectCountry);
          });

          page += 1;

          cb();
        };

        api.getObjectsBySearchQuery(window.testWikimapiaObjectTitle, page);
      },
      function (err) {
        if (err) {
          throw err;
        }
        test.ok(founded);
        test.done();
      }
    );
  }
};
