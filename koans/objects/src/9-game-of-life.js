var SAMURAIPRINCIPLE = {};
SAMURAIPRINCIPLE.isCellAliveInNextGeneration = function (isCellAlive, numberOfNeighbours) {

	// solution 1
	return {
		true: {
			2: true,
			3: true
		},
		false: {
			3: true
		}
	}[isCellAlive].hasOwnProperty(numberOfNeighbours);
	
	// solution 2
	var lookupNum = {
		"2" : isCellAlive,
		"3" : true
	}

	return !!lookupNum['' + numberOfNeighbours];

	// solution 3
	var lookupAliveNum = {
		"2" : true,
		"3" : true
	};
	var lookupDeadNum = {
		"3" : true
	};
	var lookupCellAlive = {
		"true" : lookupAliveNum,
		"false" : lookupDeadNum
	};

	var boolString = '' + isCellAlive;
	var numString = '' + numberOfNeighbours;

	return !!lookupCellAlive[boolString][numString];	// turn truthy or falsy into boolean - double cast

	// another example that avoids getting undefined
	//var cellLookup = lookupCellAlive[boolString];
	//return cellLookup.hasOwnProperty(numString) && cellLookup[numString];

};
