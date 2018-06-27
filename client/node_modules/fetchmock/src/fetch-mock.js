/**
* Guesses wether the status is or not an error status. Assumes that any >=400 status is error
* @param {number} status Status code
* @returns {boolean}
*/
function isError(status) {
  return status >= 400;
}

/**
* Constructs a new FetchMock object
* @returns {Function} Fetch Mock
* @constructor
*/
var FetchMock = function () {
  this.requests = [];
  this.expectations = [];
};

/**
* Establishes a POST request expectation and the result it will be returned from it
* @param {RegExp} pattern URL pattern to match the request
* @param {Object} result Object with all the result data
* @param {boolean} json Encode body as JSON
*/
FetchMock.prototype.expectPOST = function (pattern, result, json) {
  this.expect('POST', pattern, result, json);
};

/**
* Establishes a PUT request expectation and the result it will be returned from it
* @param {RegExp} pattern URL pattern to match the request
* @param {Object} result Object with all the result data
* @param {boolean} json Encode body as JSON
*/
FetchMock.prototype.expectPUT = function (pattern, result, json) {
  this.expect('PUT', pattern, result, json);
};

/**
* Establishes a DELETE request expectation and the result it will be returned from it
* @param {RegExp} pattern URL pattern to match the request
* @param {Object} result Object with all the result data
* @param {boolean} json Encode body as JSON
*/
FetchMock.prototype.expectDELETE = function (pattern, result, json) {
  this.expect('DELETE', pattern, result, json);
};

/**
* Establishes a PATCH request expectation and the result it will be returned from it
* @param {RegExp} pattern URL pattern to match the request
* @param {Object} result Object with all the result data
* @param {boolean} json Encode body as JSON
*/
FetchMock.prototype.expectPATCH = function (pattern, result, json) {
  this.expect('PATCH', pattern, result, json);
};

/**
* Establishes a HEAD request expectation and the result it will be returned from it
* @param {RegExp} pattern URL pattern to match the request
* @param {Object} result Object with all the result data
* @param {boolean} json Encode body as JSON
*/
FetchMock.prototype.expectHEAD = function (pattern, result, json) {
  this.expect('HEAD', pattern, result, json);
};

/**
* Establishes a GET request expectation and the result it will be returned from it
* @param {RegExp} pattern URL pattern to match the request
* @param {Object} result Object with all the result data
* @param {boolean} json Encode body as JSON
*/
FetchMock.prototype.expectGET = function (pattern, result, json) {
  this.expect('GET', pattern, result, json);
};

/**
* Establishes a request expectation and the result it will be returned from it
* @param {string} method Method of the request
* @param {RegExp} pattern URL pattern to match the request
* @param {Object} result Object with all the result data
* @param {boolean} json Encode body as JSON
*/
FetchMock.prototype.expect = function (method, pattern, result, json) {
  if (!(pattern instanceof RegExp)) {
    throw 'Pattern must be a RegExp';
  }

  if (!(typeof result === 'object' && result.status && !isNaN(Number(result.status)) && result.body)) {
    throw 'Invalid result given for expectation of method ' + method + ' and pattern ' + pattern;
  }

  var headers = result.headers || {};
  if (!headers['Content-Type'] && json) {
    headers['Content-Type'] = 'application/json';
  }

  this.expectations.push({
    pattern: pattern,
    method: method,
    status: Number(result.status),
    body: json ? JSON.stringify(result.body) : result.body,
    headers: result.headers || {},
    matched: false
  });
};

// In whatwg-fetch Response is not exposed so this function is grabbed
// from that lib for it to work
(function (window) {
  function Headers(headers) {
    this.map = {};

    if (headers instanceof Headers) {
      headers.forEach(function(value, name) {
        this.append(name, value);
      }, this);

    } else if (headers) {
      Object.getOwnPropertyNames(headers).forEach(function(name) {
        this.append(name, headers[name]);
      }, this);
    }
  }

  Headers.prototype.append = function(name, value) {
    name = normalizeName(name);
    value = normalizeValue(value);
    var list = this.map[name];
    if (!list) {
      list = [];
      this.map[name] = list;
    }
    list.push(value);
  };

  Headers.prototype['delete'] = function(name) {
    delete this.map[normalizeName(name)];
  };

  Headers.prototype.get = function(name) {
    var values = this.map[normalizeName(name)];
    return values ? values[0] : null;
  };

  Headers.prototype.getAll = function(name) {
    return this.map[normalizeName(name)] || [];
  };

  Headers.prototype.has = function(name) {
    return this.map.hasOwnProperty(normalizeName(name));
  };

  Headers.prototype.set = function(name, value) {
    this.map[normalizeName(name)] = [normalizeValue(value)];
  };

  Headers.prototype.forEach = function(callback, thisArg) {
    Object.getOwnPropertyNames(this.map).forEach(function(name) {
      this.map[name].forEach(function(value) {
        callback.call(thisArg, value, name, this);
      }, this);
    }, this);
  };

  function consumed(body) {
    if (body.bodyUsed) {
      return Promise.reject(new TypeError('Already read'));
    }
    body.bodyUsed = true;
  }

  function fileReaderReady(reader) {
    return new Promise(function(resolve, reject) {
      reader.onload = function() {
        resolve(reader.result);
      };
      reader.onerror = function() {
        reject(reader.error);
      };
    });
  }

  function readBlobAsArrayBuffer(blob) {
    var reader = new FileReader();
    reader.readAsArrayBuffer(blob);
    return fileReaderReady(reader);
  }

  function readBlobAsText(blob) {
    var reader = new FileReader();
    reader.readAsText(blob);
    return fileReaderReady(reader);
  }

  var support = {
    blob: 'FileReader' in self && 'Blob' in self && (function() {
      try {
        new Blob();
        return true;
      } catch(e) {
        return false;
      }
    })(),
    formData: 'FormData' in window
  };

  function Body() {
    this.bodyUsed = false;

    this._initBody = function(body) {
      this._bodyInit = body;
      if (typeof body === 'string') {
        this._bodyText = body;
      } else if (support.blob && Blob.prototype.isPrototypeOf(body)) {
        this._bodyBlob = body;
      } else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
        this._bodyFormData = body;
      } else if (!body) {
        this._bodyText = '';
      } else {
        throw new Error('unsupported BodyInit type');
      }
    };

    if (support.blob) {
      this.blob = function() {
        var rejected = consumed(this);
        if (rejected) {
          return rejected;
        }

        if (this._bodyBlob) {
          return Promise.resolve(this._bodyBlob);
        } else if (this._bodyFormData) {
          throw new Error('could not read FormData body as blob');
        } else {
          return Promise.resolve(new Blob([this._bodyText]));
        }
      };

      this.arrayBuffer = function() {
        return this.blob().then(readBlobAsArrayBuffer);
      };

      this.text = function() {
        var rejected = consumed(this);
        if (rejected) {
          return rejected;
        }

        if (this._bodyBlob) {
          return readBlobAsText(this._bodyBlob);
        } else if (this._bodyFormData) {
          throw new Error('could not read FormData body as text');
        } else {
          return Promise.resolve(this._bodyText);
        }
      };
    } else {
      this.text = function() {
        var rejected = consumed(this);
        return rejected ? rejected : Promise.resolve(this._bodyText);
      };
    }

    if (support.formData) {
      this.formData = function() {
        return this.text().then(decode);
      };
    }

    this.json = function() {
      return this.text().then(JSON.parse);
    };

    return this;
  }

  function Response(bodyInit, options) {
    if (!options) {
      options = {};
    }

    this._initBody(bodyInit);
    this.type = 'default';
    this.url = null;
    this.status = options.status;
    this.ok = this.status >= 200 && this.status < 300;
    this.statusText = options.statusText;
    this.headers = options.headers instanceof Headers ? options.headers : new Headers(options.headers);
    this.url = options.url || '';
  }

  Body.call(Response.prototype);

  window.Response = Response;
}(window));

/**
* Fetches a resource from the internet (it's a fake fetch)
* @param {string} url Request URL
* @param {Object} options Options object with the request options
* @returns {Promise}
*/
FetchMock.prototype.fetch = function (url, options) {
  if (typeof options !== 'object') {
    throw 'invalid options given to fetch for url ' + url;
  }

  var _resolve, _reject;
  var promise = new Promise(function (resolve, reject) {
    _resolve = resolve;
    _reject = reject;
  });
  var request = {
    url: url,
    method: options.method || 'GET',
    headers: options.headers || {},
    body: options.body,
    flushed: false,
    promise: promise,
    _resolve: _resolve,
    _reject: _reject
  };

  this.requests.push(request);

  return new Promise(function (resolve, reject) {
    request.promise
    .then(function (response) {
      resolve(response);
    })
    .catch(function (response) {
      reject(response);
    });
  });
};

/**
* Resets the fetch mock state
*/
FetchMock.prototype.reset = function () {
  this.requests = [];
  this.expectations = [];
};

/**
* Releases all the pending requests and matches all the expectations. If there's an unexpected
* request or an expectation is not matched it will throw an error.
*/
FetchMock.prototype.flush = function () {
  var self = this;
  self.requests.forEach(function (request, i) {
    if (request.flushed) {
      return;
    }

    self.expectations.reverse().forEach(function (expectation, j) {
      if (expectation.pattern.test(request.url) &&
          expectation.method.toUpperCase() === request.method.toUpperCase()) {
        if (!request.flushed) {
          var response = new Response(expectation.body, {
            status: expectation.status,
            headers: expectation.headers
          });

          if (!isError(expectation.status)) {
            request._resolve(response);
          } else {
            request._reject(response);
          }
        }

        self.expectations[j].matched = true;
        self.requests[i].flushed = true;
      }
    });
  });

  self.requests.forEach(function (request) {
    if (!request.flushed) {
      throw 'Unexpected request: ' + request.url;
    }
  });

  self.expectations.forEach(function (expectation) {
    if (!expectation.matched) {
      throw 'Expecting request to match pattern ' + expectation.pattern;
    }
  });
};

// Substitute window.fetch with out own mock implementation
window._FetchMock = FetchMock;
window.FetchMock = new FetchMock();
window.fetch = window.FetchMock.fetch.bind(window.FetchMock);
