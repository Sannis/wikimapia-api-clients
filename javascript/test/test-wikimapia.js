this.test_wikimapia = {
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

    api.getObjectById(55);
  }
};
