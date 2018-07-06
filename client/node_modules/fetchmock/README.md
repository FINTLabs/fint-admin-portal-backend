# fetchmock [![Build Status](https://travis-ci.org/mvader/fetchmock.svg)](https://travis-ci.org/mvader/fetchmock)
window.fetch mock object inspired by Angular.js $httpBackend mock.

## Install
```
npm install fetchmock
```

**Note:** Requires ES6 promises (you can install them via bower or npm ```npm install es6-promise``` or ```bower install es6-promise```)

## API

**Note:** fetchmock substitutes window.fetch with a mocked implementation of fetch for testing. Once you include this file the real fetch will be lost.

### FetchMock

```FetchMock``` is available at ```window``` and can be used to setup the mocks with expectations.

#### expect
```expect``` is where the magic of FetchMock happens. You can add expectations, that is, a request you are expecting to be made by the client. This method does not have any side effect, just adds the expectation to the list of expectations. To trigger the validation of expectations you should use ```flush```.
```
/**
 * Establishes a request expectation and the result it will be returned from it
 * @param {string} method Method of the request
 * @param {RegExp} pattern URL pattern to match the request
 * @param {Object} result Object with all the result data
 * @param {boolean} json Encode body as JSON
 */
```
The result object passed to expect can have 3 items:
* **status** (Number and mandatory): status of the response
* **body** (Object or String and mandatory): body of the response
* **headers** (Object and optional): headers of the response

**Example:**
```javascript
describe('a GET request to /users', function () {
  it('should be made', function () {
    // Our expectation
    FetchMock.expect('GET', /\/users$/, {
      status: 200,
      body: {
        users: ['Hugh', 'Chuck', 'Delilah']
      },
      headers: {
        'Content-Type': 'application/json'
      }
    }, true);

    // function that calls fetch on /users
    requestUsers();

    // When we call flush all the requests are resolved (and thus, the content of the promises is fulfilled)
    // and the expectations are matched. If any request is not flushed (because it matches no expectation)
    // or an expectation is not matched by any request
    // this method will throw an error
    FetchMock.flush();
  });
});
```

#### expectGET
#### expectPOST
#### expectPUT
#### expectPATCH
#### expectDELETE
#### expectHEAD
These are shorthand methods for ```FetchMock.expect('MY METHOD', ...)```.

**Example:**
```javascript
describe('a GET request to /users', function () {
  it('should be made', function () {
    FetchMock.expectGET(/\/users$/, {
      status: 200,
      body: {
        users: ['Hugh', 'Chuck', 'Delilah']
      },
      headers: {
        'Content-Type': 'application/json'
      }
    }, true);

    requestUsers();

    FetchMock.flush();
  });
});
```

#### reset
Resets all the requests and expectations.
```javascript
describe('a GET request to /users', function () {
  afterAll(function () {
    // Reset requests and expectations after all tests are executed
    FetchMock.reset();
  });

  it('should be made', function () {
    FetchMock.expectGET(/\/users$/, {
      status: 200,
      body: {
        users: ['Hugh', 'Chuck', 'Delilah']
      }
    }, true);

    requestUsers();
    FetchMock.flush();
  });
});
```

#### flush
Flushes all the requests. Iterates over all the requests made with fetch and tries to match them with the expectations. If a request matches an expectation the request will be resolved or rejected with the content of the result passed to the expectation.
If any request is not flushed (because it matches no expectation) or an expectation is not matched by any request this method will throw an error.
When expectations are matched they are in reverse add order, that is, if you add an expectations for /users/ and then an expectation for /users\/list/ only the last one will be matched.

You can see examples of usage of flush in previous examples.
