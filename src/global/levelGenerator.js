import {Sides, Tiles, rotateTile} from './Tiles';
import {randomInRange} from './utils'

const DIRECTIONS = [0b1000, 0b0100, 0b0010, 0b0001];

const oppositeDirection = direction => {
  switch (direction) {
    case Sides.UP: return Sides.DOWN;
    case Sides.RIGHT: return Sides.LEFT;
    case Sides.DOWN: return Sides.UP;
    case Sides.LEFT: return Sides.RIGHT;
  }
}

const emptyLevel = (rows, columns) => Array(rows).fill().map(_ => Array(columns).fill())

const cloneLevel = level => level.map(row => [...row])

const shuffle = level => {
  var clone = cloneLevel(level)
  const rows = level.length;
  const columns = level[0].length;
  for (var i = 0; i < 1000; i++) {
    const row = randomInRange(0, rows);
    const column = randomInRange(0, columns);

    clone[row][column] = rotateTile(clone[row][column]);
  }
  return clone;
}

const loopBasedLevelBuilder = (rows, columns) => {
  var confirmedLevel = emptyLevel(rows, columns);
  const loops = randomInRange(4, 10);

  for (var loop = 0; loop < loops; loop++) {
    const startRow = randomInRange(0, rows);
    const startColumn = randomInRange(0, columns);
    const length = randomInRange(4, 15);

    attempts: for (var i = 0; i < 1000; i++) {
      var currentRow = startRow;
      var currentColumn = startColumn;
      var level = cloneLevel(confirmedLevel);

      //console.log("New attempt");

      for (var step = 0; step < length; step++) {
        var direction;
        var nextRow = currentRow;
        var nextColumn = currentColumn;
        while (true) {
          direction = DIRECTIONS[randomInRange(0, 4)];
          switch (direction) {
            case Sides.UP:
              if (nextRow == 0) continue;
              nextRow--;
              break;
            case Sides.RIGHT:
              if (nextColumn == (columns - 1)) continue;
              nextColumn++;
              break;
            case Sides.DOWN:
              if (nextRow == (rows - 1)) continue;
              nextRow++;
              break;
            case Sides.LEFT:
              if (nextColumn == 0) continue;
              nextColumn--;
              break;
          }
          break;
        }

        level[currentRow][currentColumn] |= direction
        level[nextRow][nextColumn] |= oppositeDirection(direction);
        currentRow = nextRow;
        currentColumn = nextColumn;

        if (step >= 4 && (currentRow == startRow) && (currentColumn == startColumn)) {
            confirmedLevel = level;
            break attempts;
        }
      }
    }
  }

  return confirmedLevel;
}

/*
Generator uses the following structure for tiles for speed:

Each tile is a 4-bit integer: 3210 where
3-rd bit stands for UP tile, 2-nd for RIGHT, 1-st for DOWN and 0-th for LEFT.
*/
const isConnected = (level) => {
  var foundNonEmptyCell = false;
  for (const rowIndex of level.keys()) {
    const firstRow = rowIndex == 0;
    const lastRow = rowIndex == level.length - 1;

    for (const columnIndex of level[rowIndex].keys()) {
      const firstColumn = columnIndex == 0;
      const lastColumn = columnIndex == level[rowIndex].length - 1;

      const cell = level[rowIndex][columnIndex];
      for (const side of DIRECTIONS) {
        if ((cell & side) != 0) {
          foundNonEmptyCell = true;
          var adjacentCell;
          var mask;
          switch (side) {
            case Sides.UP:
              mask = Sides.DOWN;
              adjacentCell = firstRow ? 0 : level[rowIndex - 1][columnIndex];
              break;
            case Sides.RIGHT:
              mask = Sides.LEFT;
              adjacentCell = lastColumn ? 0 : level[rowIndex][columnIndex + 1];
              break;
            case Sides.DOWN:
              mask = Sides.UP;
              adjacentCell = lastRow ? 0 : level[rowIndex + 1][columnIndex];
              break;
            case Sides.LEFT:
              mask = Sides.RIGHT;
              adjacentCell = firstColumn ? 0 : level[rowIndex][columnIndex - 1];
              break;
          }

          if ((adjacentCell & mask) == 0)
            return false;
        }
      }
    }
  }
  return foundNonEmptyCell;
}

const randomLevelBuilder = (rows, columns) => {
  var level;

  for (var i = 0; i < 1000000; i++) {
    level = Array(rows).fill().map(_ => Array(columns).fill().map(_ => Math.floor(Math.random() * 15 + 1)));
    if (!isConnected(level))
      return level;
  }

  return null;
};

const simpleLevelGenerator = (rows, columns) => {
  var level = emptyLevel(rows, columns);
  level[0][0] = Sides.UP | Sides.LEFT;
  level[0][1] = Sides.UP | Sides.RIGHT;
  level[1][0] = Sides.UP | Sides.RIGHT;
  level[1][1] = Sides.UP | Sides.LEFT;
  return level;
}

const levelGenerator = (rows, columns) => {
  const level = loopBasedLevelBuilder(rows, columns);
  return shuffle(level);
  //return simpleLevelGenerator(rows, columns);
}

export { isConnected, levelGenerator };
export default levelGenerator;
