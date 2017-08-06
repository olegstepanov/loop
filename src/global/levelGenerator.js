import {Sides, Tiles} from './Tiles';

const buildLevel = (rows, columns) => {
  var level = Array(rows).fill().map(_ => Array(columns).fill())

  return null;
}

/*
Generator uses the following structure for tiles for speed:

Each tile is a 4-bit integer: 3210 where
3-rd bit stands for UP tile, 2-nd for RIGHT, 1-st for DOWN and 0-th for LEFT.
*/
const isConnected = (level) => {
  for (const rowIndex of level.keys()) {
    const firstRow = rowIndex == 0;
    const lastRow = rowIndex == level.length - 1;

    for (const columnIndex of level[rowIndex].keys()) {
      const firstColumn = columnIndex == 0;
      const lastColumn = columnIndex == level[rowIndex].length - 1;

      const cell = level[rowIndex][columnIndex];
      for (const side of [0b1000, 0b0100, 0b0010, 0b0001]) {
        if (cell & side != 0) {
          var adjacentCell;
          var mask;
          switch (side) {
            case 0b1000:
              mask = 0b0010;
              adjacentCell = firstRow ? 0 : level[rowIndex - 1][columnIndex];
              break;
            case 0b0100:
              mask = 0b0001;
              adjacentCell = lastColumn ? 0 : level[rowIndex][columnIndex + 1];
              break;
            case 0b0010:
              mask = 0b1000;
              adjacentCell = lastRow ? 0 : level[rowIndex + 1][columnIndex];
              break;
            case 0b0001:
              mask = 0b0100;
              adjacentCell = firstColumn ? 0 : level[rowIndex][columnIndex - 1];
              break;
          }

          if ((adjacentCell & mask) == 0)
            return false;
        }
      }
    }
  }
  return true;
}

const levelGenerator = (rows, columns) => {
  var level;

  for (var i = 0; i < 1000000; i++) {
    level = Array(rows).fill().map(_ => Array(columns).fill().map(_ => Math.floor(Math.random() * 15 + 1)));
    if (!isConnected(level))
      return level;
  }

  return null;
};

export { isConnected, levelGenerator };
export default levelGenerator;
