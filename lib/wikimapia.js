/*!
 * Copyright by Oleg Efimov
 *
 * See license text in LICENSE file
 */

var request = require('request');

var Wikimapia = function (options) {
  // Default options
  this.options = {
    url: 'http://api.wikimapia.org/',
    key: 'F09D7CEF-C79C4691-E311E506-54999C19-73DF1B6C-DCBA00AC-B7CE2ABC-FED89F9B',
    format: 'json'
  };

  // Incoming options
  for (var key in options) {
    this.options[key] = options[key];
  }
};

Wikimapia.prototype.getObject = function (id, callback) {
  if (typeof callback !== 'function') {
    throw new TypeError('Wikimapia.getObject second argument must be a callback function');
  }

  var self = this;

  request.get({
      url: this.options.url + '?function=object&key=' + this.options.key + '&format=' + this.options.format + '&id=' + id
    },
    function (err, response, body) {
      if (err) {
        callback(err);
      } else if (response.statusCode == 200) {
        if (self.options.format == 'json') {
          body = JSON.parse(body);
        }
        callback(null, body);
      } else {
        callback(new Error('Response status code is ' + response.statusCode));
      }
    }
  );
};

module.exports = Wikimapia;
