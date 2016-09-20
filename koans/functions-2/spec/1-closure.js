describe('Warmup - timers and asynchronous specs', function () {
  /*
    tip: if change describe into xdescribe the suite will no longer be executed
    you may wish to do that when you move onto the second part of the assignement (because this is a long running suite)
  */
  it('0 - should understand why we need asynchronous specs (so that this spec doesnt just pass)', function () {
    setTimeout(function () {
      //expect(1).toBe(2);
    }, 100);
    // this spec passes, but then when the timeout function is executed in the future it may fail random spec
  });
  it('1 - should understand timers', function (done) {
    var i = 0, t0 = Date.now();
    setTimeout(function () {
      i = 1;
      console.log(5, i, Date.now() - t0);
    }, 200);
    console.log(1, i, Date.now() - t0);
    setTimeout(function () {
      expect(i).toBe(0);
      console.log(4, i, Date.now() - t0);
    }, 100);
    console.log(2, i, Date.now() - t0);
    setTimeout(function () {
      expect(i).toBe(1);
      console.log(6, i, Date.now() - t0);
      done();
    }, 300);
    console.log(3, i, Date.now() - t0);
    expect(i).toBe(0);
  });
  it('2 - should understand timers', function (done) {
    var i = 0, t0 = Date.now();
    expect(i).toBe(0);
    console.log(1, i, Date.now() - t0);
    setTimeout(function () {
      i = 1;
      console.log(4, i, Date.now() - t0);
    }, 0);
    console.log(2, i, Date.now() - t0);
    expect(i).toBe(0);
    setTimeout(function () {
      expect(i).toBe(1);
      console.log(5, i, Date.now() - t0);
      done();   // "move on to next test"
    }, 1);
    console.log(3, i, Date.now() - t0);
    expect(i).toBe(0);
  });
  it('3 - should understand timers', function (done) {
    var i = 0, loopDueTime = Date.now() + 1000;
    setTimeout(function () {
      i = 1;
    }, 300);
    while (new Date().getTime() <= loopDueTime) {
    }
    expect(i).toBe(0);
    setTimeout(function () {
      expect(i).toBe(1);
      done();
    }, 0);
    expect(i).toBe(0);
  });
});
// execution is to finish all real-time calls, then go to timeouts - first timeout is 700ms overdue
// it picks the one which is most overdue
describe('Closure', function (done) {
  'use strict';
  it('1 - should understand loop and closure', function (done) {
    var i, debugElement = jQuery('#debug');
    debugElement.text('');
    for (i = 0; i < 3; i += 1) {
      setTimeout(function () {
        debugElement.append(i);
      }, 1000 * (i + 1));
    }
    setTimeout(function () {
      expect(debugElement.text()).toBe('333');
      done();
      //discuss this with your pair
      //now change the code within setTimeout (and within setTimeout only) so that expected result is '123'
    }, 4000);
  });
});
//now change the code within setTimeout (and within setTimeout only) so that expected result is '123'
describe('Closure custom 1', function (done) {
  'use strict';
  it('1 - should understand loop and closure', function (done) {
    var i, debugElement = jQuery('#debug');
    debugElement.text('');
    for (i = 0; i < 3; i += 1) {
      appendTimeoutVal(i+1);
    }

    function appendTimeoutVal(dVal) {
      setTimeout(function () {
        debugElement.append(dVal);
      }, 1000 * dVal);
    }

    setTimeout(function () {
      expect(debugElement.text()).toBe('123');
      done();
    }, 4000);
  });
});
//now change the code within setTimeout (and within setTimeout only) so that expected result is '123'
describe('Closure custom 2', function (done) {
  'use strict';
  it('1 - should understand loop and closure', function (done) {
    var i, debugElement = jQuery('#debug');
    debugElement.text('');
    for (i = 0; i < 3; i += 1) {
      setTimeout(
        (function(dVal) {
          return function () {
            debugElement.append(dVal);
          };
        })(i+1), 
        1000 * (i + 1));
    }

    setTimeout(function () {
      expect(debugElement.text()).toBe('123');
      done();
    }, 4000);
  });
});
