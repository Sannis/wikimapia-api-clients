/*!
 * Copyright by Oleg Efimov
 *
 * See license text in LICENSE file
 */

var request = require('request');
var querystring = require('querystring');

/**
 * Builds query URL for API request
 *
 * @todo Change variables names
 * 
 * @param apiOptions
 * @param requestParameters
 * @param method
 *
 * @return string
 */
function makeRequestUrl(apiOptions, requestParameters, method) {
  var
    params = {},
    key,
    apiUrl;
  
  // Set global options
  for (key in apiOptions) {
    if (apiOptions.hasOwnProperty(key)) {
      params[key] = apiOptions[key];
    }
  }

  // Overwrite global options with request parameters
  for (key in requestParameters) {
    if (requestParameters.hasOwnProperty(key)) {
      params[key] = requestParameters[key];
    }
  }

  // Add API function name
  params['function'] = method;

  // Get API URL
  apiUrl = params.url;
  delete params.url;

  return apiUrl + '?' + querystring.stringify(params);
}

/**
 * Callback function for request, checked result and decode result format
 *
 * @param format
 * @param callback
 */
function standardRequestCallback(format, callback) {
  return function (err, response, body) {
    if (err) {
      callback(err);
    } else if (response.statusCode === 200) {
      if (format === 'json') {
        body = JSON.parse(body);
      }
      callback(null, body);
    } else {
      callback(new Error('Response status code is ' + response.statusCode));
    }
  };
}

/**
 * Wikimapia API object constructor
 *
 * @param options
 */
var Wikimapia = module.exports = function (options) {
  var key;
  
  // Default options
  this.options = {
    url: 'http://api.wikimapia.org/',
    key: 'F09D7CEF-C79C4691-E311E506-54999C19-73DF1B6C-DCBA00AC-B7CE2ABC-FED89F9B',
    format: 'json'
  };

  // Incoming options
  for (key in options) {
    if (options.hasOwnProperty(key)) {
      this.options[key] = options[key];
    }
  }
};

/**
 * API 'getObject' method
 *
 * @param id
 * @param callback
 */
Wikimapia.prototype.object = function (id, callback) {
  if (typeof callback !== 'function') {
    throw new TypeError('Wikimapia.object second argument must be a callback function');
  }

  request.get(
    {url: makeRequestUrl(this.options, {id: id}, 'object')},
    standardRequestCallback(this.options.format, callback)
  );
};

/**
 * API 'search' method
 *
 * @param query
 * @param page
 * @param callback
 */
Wikimapia.prototype.search = function (query, page, callback) {
  if (typeof callback !== 'function') {
    throw new TypeError('Wikimapia.search second argument must be a callback function');
  }

  request.get(
    { url: makeRequestUrl(this.options, {q: query, page: page}, 'search') },
    standardRequestCallback(this.options.format, callback)
  );
};
