var SAMURAIPRINCIPLE = {};

SAMURAIPRINCIPLE.GameOfLife = function() {
	this.separator = '-';
	this.liveCells = [];

	this.isCellAlive = function(row, col) {
		return this.liveCells.indexOf(row + this.separator + col) >= 0;
	};

	this.toggleCellState = function(row, col) {
		var cellVal = row + this.separator + col;

		if(this.isCellAlive(row, col)) {
			this.liveCells.splice(this.liveCells.indexOf(cellVal),1);	// remove item if alive t make it dead
		}
		else {
			this.liveCells.push(cellVal);	// if cell is dead add it into array to make it alice
		}
		return this;
	};

	this.tick = function() {
		console.log('tick');
		// new cells
		var newCells = [];
		// // find new live cells
		for(i=0; i<this.liveCells.length; i++) {
			inx = this.liveCells[i].split(this.separator);
			var j;
			var k;
			for(j=-1; j<=1; j++) {
				for(k=-1; k<=1; k++) {
					rowJ = parseInt(inx[0],10)+j;
					colK = parseInt(inx[1],10)+k;
					if((j!=0 || k!=0) && !this.isCellAlive(rowJ,colK)) {
						numLiveNBs = this.findLiveNeighbours(rowJ,colK).length;
						if(numLiveNBs == 3) {
							var newVal = rowJ+''+this.separator+''+colK
							if(newCells.indexOf(newVal) < 0) {
								newCells.push(rowJ+this.separator+colK);	// add cell from array
								console.log('alive '+(rowJ+this.separator+colK));
							}
						}
					}
				}
			}
		}

		var oldCells = ([]).concat(this.liveCells);
		var i;
		for(i=0; i<this.liveCells.length; i++) {
			var inx = this.liveCells[i].split(this.separator);
			var numLiveNBs = this.findLiveNeighbours(parseInt(inx[0],10),parseInt(inx[1],10)).length;
			if(numLiveNBs < 2 || numLiveNBs > 3) {
				oldCells.splice(oldCells.indexOf(inx[0]+this.separator+inx[1]),1);
				console.log('kill '+inx);
			}
		}
		this.liveCells = oldCells.concat(newCells);
		console.log(this.liveCells);
	};

	this.findLiveNeighbours = function (row, col) {
		var i;
		var j;
		result = [];
		for(i=-1; i<=1; i++) {
			for(j=-1; j<=1; j++) {
				if((i!=0 || j!=0) && this.isCellAlive(row+i,col+j)) {	// skip middle cell
					result.push((row+i) + this.separator + (col+j));
				}
			}
		}
		return result;
	}
};