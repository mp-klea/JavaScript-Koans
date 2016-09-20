//refactor this so that object with mapping is not created every time (i.e. it is created at most once)
//however, make sure nothing else goes into global namespace (except colorLookup function)

(function () {
	var colourObject = {
	    'red': 0xFF0000,
	    'green': 0x00FF00,
	    'blue': 0x0000FF
	  };

  	colorLookup = function(colorString) {
  		return colourObject[colorString];
  	}
})();

// we don't really need this line if we don't use var but it makes it more explicit
var colorLookup;	// we can also use window.colorLookup in the assignment

// another solution
// var colorLookup = (function () {
// 	var colourObject = {
// 	    'red': 0xFF0000,
// 	    'green': 0x00FF00,
// 	    'blue': 0x0000FF
// 	  };

//   	return function(colorString) {
//   		return colourObject[colorString];
//   	}
// })();

//test should remain the same
describe('Module pattern', function () {
  it('1 - should understand revealing module pattern', function () {
    expect(colorLookup('red')).toBe(0xFF0000);
    expect(colorLookup('unknown color')).toBeUndefined();
  });
});
