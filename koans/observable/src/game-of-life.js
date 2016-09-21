/*global jQuery*/
var SAMURAIPRINCIPLE = SAMURAIPRINCIPLE || {};
SAMURAIPRINCIPLE.GameOfLife = function () {
  var self = this,
    isAlive = {},
    cellKey = function (row, column) {
      return row + '_' + column;
    };

  // add event functionality
  SAMURAIPRINCIPLE.eventDispatcher(this);

  this.isCellAlive = function (row, column) {
    return isAlive[cellKey(row, column)] || false;
  };
  this.toggleCellState = function (row, column) {
    var key = cellKey(row, column);
    if (isAlive[key]) {
      delete isAlive[key];
      this.dispatchEvent('cellStateChanged', row, column, false);
    } else {
      isAlive[key] = true;
      this.dispatchEvent('cellStateChanged', row, column, true);
    }
    return this;
  };
  this.tick = function () {
    var key, parts, row, column, numberOfNeighbours = {}, neighbourKey;
    for (key in isAlive) {
      parts = key.split('_');
      row = parseInt(parts[0], 10);
      column = parseInt(parts[1], 10);
      numberOfNeighbours[key] = numberOfNeighbours[key] || 0;
      [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]].forEach(function (offset) {
        neighbourKey = cellKey(row + offset[0], column + offset[1]);
        numberOfNeighbours[neighbourKey] = (numberOfNeighbours[neighbourKey] || 0) + 1;
      });
    }
    for (key in numberOfNeighbours) {
      if (isAlive[key] && (numberOfNeighbours[key] < 2 || numberOfNeighbours[key] > 3) || !isAlive[key] && numberOfNeighbours[key] === 3) {
        parts = key.split('_');
        row = parseInt(parts[0], 10);
        column = parseInt(parts[1], 10);
        self.toggleCellState(row, column);
      }
    }
  };
};

jQuery.fn.extend({
  gameOfLifeWidget: function (gameOfLife, rows, columns, animationDuration) {
    return this.each(function () {
      var rootElement = jQuery(this);

      // rootElement.find('td').click(function() {
      //   gameOfLife.toggleCellState(3,4,{});
      // });
      rootElement.find('td').each(function(index) {
          //console.log(index, this, jQuery(this));
          jQuery(this).click(function() {
            var i = Math.floor(index / columns);
            var j = index - (columns * i);
            //console.log(i + '-' + j); 
            gameOfLife.toggleCellState(i,j,{});
          });
      });
      rootElement.find('.tick').click(function() {
        gameOfLife.tick();
      });
      gameOfLife.addEventListener('cellStateChanged', function(row, column, isAlive) {
        rootElement.find('.grid tr:nth-child(' + (row+1) + ') td:nth-child(' + (column+1) + ')').toggleClass('alive', animationDuration);
        // if(isAlive) {
        //     rootElement.find('.grid tr:nth-child(' + (row+1) + ') td:nth-child(' + (column+1) + ')').addClass('alive', animationDuration);
        //   }
        //   else {
        //     rootElement.find('.grid tr:nth-child(' + (row+1) + ') td:nth-child(' + (column+1) + ')').removeClass('alive', animationDuration);
        //   }
      })
    });
  }
});
