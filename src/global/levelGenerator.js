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

const emptyLevel = (rows, columns) => Array(rows).fill().map(_ => Array(columns).fill(0))

const cloneLevel = level => level.map(row => [...row])

const getFillFactor = level => (0.0 + _.sum(level.map(row => _.takeRightWhile(row.slice().sort(), c => c > 0).length))) / (level.length * level[0].length)

const expectedFillFactor = index => {
  var fillFactor;

  if (index < 3)
    fillFactor = 0.3;
  else if (index < 10)
    fillFactor = 0.5;
  else
    fillFactor = 0.7;

  return fillFactor;
}

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

const addLoop = (level) => {
  const rows = level.length;
  const columns = level[0].length;
  const startRow = randomInRange(0, rows);
  const startColumn = randomInRange(0, columns);
  const length = randomInRange(4, 10);

  var currentRow = startRow;
  var currentColumn = startColumn;
  var newLevel = cloneLevel(level);

  for (var step = 0; step < length; step++) {
    var direction;
    var nextRow = currentRow;
    var nextColumn = currentColumn;

    console.log('Going from (' + currentRow + ', ' + currentColumn + ')');

    for (direction of _.shuffle(DIRECTIONS)) {
      switch (direction) {
        case Sides.UP:
          if (currentRow == 0) continue;
          nextRow = currentRow - 1;
          break;
        case Sides.RIGHT:
          if (currentColumn == columns - 1) continue;
          nextColumn = currentColumn + 1;
          break;
        case Sides.DOWN:
          if (currentRow == rows - 1) continue;
          nextRow = currentRow + 1;
          break;
        case Sides.LEFT:
          if (currentColumn == 0) continue;
          nextColumn = currentColumn - 1;
          break;
      }
      break;
    }

    console.log('Direction: ' + direction);
    console.log('To (' + nextColumn + ', ' + nextRow + ')');

    newLevel[currentRow][currentColumn] |= direction
    newLevel[nextRow][nextColumn] |= oppositeDirection(direction);
    currentRow = nextRow;
    currentColumn = nextColumn;

    if (step >= 4 && (currentRow == startRow) && (currentColumn == startColumn)) {
        return newLevel;
    }
  }

  return level;
}

const loopBasedLevelBuilder = (rows, columns, index) => {
  var level = emptyLevel(rows, columns);
  const fillFactor = expectedFillFactor(index);

  while (getFillFactor(level) < fillFactor) {
    console.log('Attempting');
    level = addLoop(level);
  }

  return level;
}

const addLoopToLeftHalf = (level) => {
  const rows = level.length;
  const columns = level[0].length;
  const startRow = randomInRange(0, rows);
  const startColumn = columns / 2 - 1;
  const length = randomInRange(4, 6);


  var currentRow = startRow;
  var currentColumn = startColumn;
  var newLevel = cloneLevel(level);
  var cellsInLoop = [];
  var logs = [];

  for (var step = 0; step < length; step++) {
    var direction;
    var nextRow;
    var nextColumn;

    cellsInLoop = [...cellsInLoop, [currentRow, currentColumn]];

    logs.push('Going from (' +
    currentRow + ', ' + currentColumn + ')');

    for (direction of _.shuffle(DIRECTIONS)) {
      nextRow = currentRow;
      nextColumn = currentColumn;

      switch (direction) {
        case Sides.UP:
          if (currentRow <= 0) continue;
          nextRow = currentRow - 1;
          break;
        case Sides.RIGHT:
          nextColumn = currentColumn + 1;
          break;
        case Sides.DOWN:
          if (currentRow >= (rows - 1)) continue;
          nextRow = nextRow + 1;
          break;
        case Sides.LEFT:
          if (currentRow <= 0) continue;
          nextColumn = nextColumn - 1;
          break;
      }

      if (_.find(cellsInLoop, [nextRow, nextColumn]) &&
          !_.isEqual([startRow, startColumn], [nextRow, nextColumn]))
        continue;

      logs.push('to (' + nextRow + ', ' + nextColumn + ')');

      break;
    }

    logs.push('Direction: ' + direction);
    logs.push('Opposite direction: ' + oppositeDirection(direction));
    newLevel[currentRow][currentColumn] |= direction;
    if (nextColumn < columns) {
      newLevel[nextRow][nextColumn] |= oppositeDirection(direction);
      currentRow = nextRow;
      currentColumn = nextColumn;
    } else {
      for (const log of logs)
        console.log(log);
      console.log("Adding loop");
      console.log(newLevel);
      return newLevel;
    }
  }

  console.log("Failure");

  return level;
}

const symmetricLevelBuilder = (rows, columns, index) => {
  if ((columns % 2) != 0)
    throw Error("Level width must be even for symmetry");

  var leftHalf = emptyLevel(rows, columns / 2);
  const fillFactor = expectedFillFactor(index);

  while (getFillFactor(leftHalf) < fillFactor) {
    if (Math.random() > 0.3)
      leftHalf = addLoop(leftHalf);
    else
      leftHalf = addLoopToLeftHalf(leftHalf);
  }

  return leftHalf.map(row => [...row, ...row.slice().reverse()]);
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

const simpleLevelGenerator = () => {
  var level = emptyLevel(2, 2);
  level[0][0] = Sides.UP | Sides.LEFT;
  level[0][1] = Sides.UP | Sides.RIGHT;
  level[1][0] = Sides.UP | Sides.RIGHT;
  level[1][1] = Sides.UP | Sides.LEFT;
  return level;
}

const generateLevel = (index) => {
  if (index == 0)
    return simpleLevelGenerator(rows, columns);

  var rows;
  var columns;

  if (index < 3)
    rows = columns = 4;
  else if (index < 10)
    rows = columns = 6;
  else if (index < 20)
    rows = columns = 8;
  else
    rows = columns = 10;

  var level;
  if (Math.random() >= 0.5) {
    console.log("Building symmetric level");
    level = symmetricLevelBuilder(rows, columns, index);
  }
  else {
    console.log("Building asymmetric level");
    level = loopBasedLevelBuilder(rows, columns);
  }

  if (level == null) {
    console.error("Could not generate level");
    return [];
  }

  return shuffle(level);
}

export { isConnected, generateLevel };
export default generateLevel;
