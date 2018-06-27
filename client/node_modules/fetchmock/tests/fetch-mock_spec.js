describe('fetch-mock', function () {
  describe('window.FetchMock', function () {
    it('should be defined', function () {
      expect(window.FetchMock).not.toBe(undefined);
    });
  });

  describe('window.fetch', function () {
    it('should be equal to window.FetchMock.fetch', function () {
      expect(window.fetch.toString()).toBe(window.FetchMock.fetch.bind(window.FetchMock).toString());
    });
  });

  describe('FetchMock', function () {
    describe('expect', function () {
      ['GET', 'POST', 'PUT', 'PATCH', 'HEAD', 'DELETE'].forEach(function (method) {
        var mock = new _FetchMock();

        describe('expect' + method, function () {
          mock['expect' + method](/^pattern$/, {
            status: 200,
            body: 'Hello'
          });

          it('should add a ' + method + ' request expectation', function () {
            expect(mock.expectations.length).toBe(1);
            expect(mock.expectations[0].method).toBe(method);
          });
        });
      });

      it('should add the given data to the expectation', function () {
        var mock = new _FetchMock();
        mock.expectGET(/^pattern$/, {
          status: 200,
          body: 'Hello world',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        var e = mock.expectations[0];

        expect(e.pattern.toString()).toBe(/^pattern$/.toString());
        expect(e.status).toBe(200);
        expect(e.body).toBe('Hello world');
        expect(e.headers).toEqual({
          'Content-Type': 'application/json'
        });
        expect(e.matched).toBe(false);
        expect(e.method).toBe('GET');
      });
    });

    describe('fetch', function () {
      var mock = new _FetchMock();
      var opts = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: 'Hello'
      };
      var url = 'http://fetch.mock';
      var promise = mock.fetch(url, opts);
      var r = mock.requests[0];

      it('should return a promise', function () {
        expect(promise instanceof Promise).toBe(true);
      });

      it('should add a request with the given data', function () {
        expect(mock.requests.length).toBe(1);
        expect(r.url).toBe(url);
        expect(r.headers).toEqual(opts.headers);
        expect(r.body).toBe(opts.body);
        expect(r.method).toBe(opts.method);
        expect(r.flushed).toBe(false);
        expect(r.promise instanceof Promise).toBe(true);
      });

      describe('when the promise is fulfilled', function () {
        var mock = new _FetchMock();
        var promise = mock.fetch(url, opts);
        var r = mock.requests[0];
        r._resolve('Test');

        it('should get the response', function () {
          promise.then(function (t) {
            expect(t).toBe('Test');
          });
        });
      });

      describe('when the promise is rejected', function () {
        var mock = new _FetchMock();
        var promise = mock.fetch(url, opts);
        var r = mock.requests[0];
        r._reject('Test');

        it('should catch the response', function () {
          promise.then(function (t) {
            expect(t).not.toBe('Test');
          })
          .catch(function (t) {
            expect(t).toBe('Test');
          });
        });
      });
    });

    describe('reset', function () {
      var mock = new _FetchMock();
      mock.expectPOST(/fetch\.mock/, {
        status: 200,
        body: 'Ok'
      });

      var opts = {
        method: 'POST',
      };
      var url = 'http://fetch.mock';
      var promise = mock.fetch(url, opts);

      it('should reset the requests and expectations', function () {
        expect(mock.requests.length).toBe(1);
        expect(mock.expectations.length).toBe(1);

        mock.reset();

        expect(mock.requests.length).toBe(0);
        expect(mock.expectations.length).toBe(0);
      });
    });

    describe('flush', function () {
      describe('when all expectations are not matched', function () {
        var mock = new _FetchMock();
        mock.expectPOST(/fetch\.mock/, {
          status: 200,
          body: 'Ok'
        });

        it('should throw an error', function () {
          expect(function () {
            mock.flush();
          }).toThrow('Expecting request to match pattern /fetch\\.mock/');
        });
      });

      describe('when all requests are not flushed', function () {
        var mock = new _FetchMock();
        var opts = {
          method: 'POST',
        };
        var url = 'http://fetch.mock';
        var promise = mock.fetch(url, opts);

        it('should throw an error', function () {
          expect(function () {
            mock.flush();
          }).toThrow('Unexpected request: ' + url);
        });
      });

      describe('when all requests are flushed and expectations matched', function () {
        var resp;
        var mock = new _FetchMock();

        beforeEach(function (done) {
          mock.expectPOST(/fetch\.mock/, {
            status: 200,
            body: 'Ok'
          });

          var opts = {
            method: 'POST',
          };
          var url = 'http://fetch.mock';
          var promise = mock.fetch(url, opts);

          promise.then(function (response) {
            expect(response.status).toBe(200);
            response.text().then(function (text) {
              resp = text;
              done();
            });
          });

          mock.flush();
        });

        it('should resolve all the requests and mark all as flushed and expectations as matched', function () {
          expect(resp).toBe('Ok');
          expect(mock.expectations[0].matched).toBe(true);
          expect(mock.requests[0].flushed).toBe(true);
        });
      });
    });
  });
});
