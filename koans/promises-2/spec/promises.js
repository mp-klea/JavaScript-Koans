describe('Promises', () => {
  let __ = jasmine.createSpy('replace me with successCallback, failureCallback (or sometimes finallyCallback)'),
    ___ = 'replace me with the value that will make the test pass',
    resolve, reject, promise,
    successCallback,
    failureCallback,
    finallyCallback;
  beforeEach(() => {
    promise = new Promise(function (res, rej) {
      resolve = res;
      reject = rej;
    });
    successCallback = jasmine.createSpy('successCallback');
    failureCallback = jasmine.createSpy('failureCallback');
    finallyCallback = jasmine.createSpy('finallyCallback');
  });

  it('should understand the toHaveBeenCalledWith matcher', function () {
    successCallback('Here is the result');

    expect(successCallback).toHaveBeenCalledWith('Here is the result');
    expect(failureCallback).not.toHaveBeenCalled();
  });
  it('should understand why one should not write tests like this (put the expectation inside then)', function () {
    promise.then(function (result) {
      //expect(result).toBe('Why is this not failing???');
    });

    resolve('Result');
  });
  it('should invoke success callback when resolved', function (done) {
    promise.then(successCallback, failureCallback);

    resolve('Result');

    setTimeout(() => {
      expect(successCallback).toHaveBeenCalledWith('Result');
      expect(failureCallback).not.toHaveBeenCalled();
      done();
    }, 1);
  });
  it('should invoke success callback even if already resolved before callback was registered', function (done) {
    resolve('Result');

    promise.then(successCallback, failureCallback);

    setTimeout(() => {
      expect(successCallback).toHaveBeenCalledWith('Result');
      expect(failureCallback).not.toHaveBeenCalled();
      done();
    }, 1);
  });
  it('should invoke failure callback when rejected', function (done) {
    promise.then(successCallback, failureCallback);

    reject('Reason');

    setTimeout(() => {
      expect(failureCallback).toHaveBeenCalledWith('Reason');
      expect(successCallback).not.toHaveBeenCalled();
      done();
    }, 1);
  });
  it('should invoke failure callback even if already rejected before callback was registered', function (done) {
    promise.then(successCallback, failureCallback);

    reject('Reason');

    setTimeout(() => {
      expect(failureCallback).toHaveBeenCalledWith('Reason');
      expect(successCallback).not.toHaveBeenCalled();
      done();
    }, 1);
  });

  describe('Chaining', function () {
    var successAsyncAction,
      failAsyncAction,
      verify;
    beforeEach(function () {
      successAsyncAction = function (result) {
        return Promise.resolve(result);
      };
      failAsyncAction = function (reason) {
        return Promise.reject(reason);
      };
      verify = function (fn, done) {
        setTimeout(function () {
          fn();
          done();
        }, 1);
      };
    });
    it('should understand Promise.then', function (done) {
      successAsyncAction('Result').then(successCallback, failureCallback);

      verify(() => {
        expect(successCallback).toHaveBeenCalledWith('Result');
        expect(failureCallback).not.toHaveBeenCalled();
      }, done);
    });

    it('should understand Promise.reject', function (done) {
      failAsyncAction('Reason').then(successCallback, failureCallback);

      verify(() => {
        expect(failureCallback).toHaveBeenCalledWith('Reason');
        expect(successCallback).not.toHaveBeenCalled();
      }, done);
    });

    it('should understand chaining 1', function (done) {
      successAsyncAction('Result')
        .then(function (result) {
          return result + ' Little extra';
        })
        .then(successCallback, failureCallback);

        verify(() => {
          expect(successCallback).toHaveBeenCalledWith('Result Little extra');
          expect(failureCallback).not.toHaveBeenCalled();
        }, done);
    });

    it('should understand chaining 2', function (done) {
      successAsyncAction('Result')
        .then(function (result) {
          return successAsyncAction(result + ' Little more');
        })
        .then(successCallback, failureCallback);

        verify(() => {
          expect(successCallback).toHaveBeenCalledWith('Result Little more');
          expect(failureCallback).not.toHaveBeenCalled();
        }, done);
    });

    it('should understand chaining 3', function (done) {
      successAsyncAction('Result')
        .then(function (result) {
          return failAsyncAction(result + ' Little more');
        })
        .then(successCallback, failureCallback);

        verify(() => {
          expect(failureCallback).toHaveBeenCalledWith('Result Little more');
          expect(successCallback).not.toHaveBeenCalled();
        }, done);
    });

    it('should understand chaining 4', function (done) {
      failAsyncAction('Reason')
        .then(function () {}, function () {
        })
        .then(successCallback, failureCallback);

        verify(() => {
          expect(successCallback).toHaveBeenCalledWith(undefined);
          expect(failureCallback).not.toHaveBeenCalled();
        }, done);
    });

    it('should understand Promise.all 1', function (done) {
      Promise.all([successAsyncAction('Result 1'), successAsyncAction('Result 2'), successAsyncAction('Result 3')])
        .then(successCallback, failureCallback);

        verify(() => {
          expect(successCallback).toHaveBeenCalledWith(['Result 1', 'Result 2', 'Result 3']);
          expect(failureCallback).not.toHaveBeenCalled();
        }, done);
    });

    it('should understand Promise.all 2', function (done) {
      Promise.all([successAsyncAction('Result 1'), failAsyncAction('Reason 2'), successAsyncAction('Result 3')])
        .then(successCallback, failureCallback);

        verify(() => {
          expect(failureCallback).toHaveBeenCalledWith('Reason 2');
          expect(successCallback).not.toHaveBeenCalled();
        }, done);
    });

    it('should understand Promise.all 3', function (done) {
      Promise.all([1, 2, 3].map(successAsyncAction))
        .then(function (result) {
          return Math.max(...result); // ... converts array into arguments
        })
        .then(successCallback, failureCallback);

        verify(() => {
          expect(successCallback).toHaveBeenCalledWith(3);
          expect(failureCallback).not.toHaveBeenCalled();
        }, done);
    });

    it('should understand Promise.all 4', function (done) {
      let getPerson = function (id) {
        return Promise.resolve({
          id: id,
          age: id * 100
        });
      };
      Promise.all([1, 2, 3].map(personId => getPerson(personId).then(p => p.age)))
        .then(function (result) {
          return Math.max(...result);
        })
        .then(successCallback, failureCallback);

        verify(() => {
          expect(successCallback).toHaveBeenCalledWith(300);
          expect(failureCallback).not.toHaveBeenCalled();
        }, done);
    });
  })
});
