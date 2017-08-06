import { combineReducers } from 'redux';
import { Tiles, rotateTile } from '../global/Tiles'
import levelGenerator from '../global/levelGenerator'

const pickRandomTile = () => {
  const tileSet = Math.floor(Math.random() * Tiles.length);
  const index = Math.floor(Math.random() * Tiles[tileSet].length);

  return { tileSet, index };
}

const level = (state = [], action) => {
  switch (action.type) {
    case 'NEXT_LEVEL':
      const level = levelGenerator(5, 5);
      if (level == null)
        console.error("Could not generate connected level");
      return level;
    case 'ROTATE_TILE':
      const rowIndex = action.coords.rowIndex;
      const columnIndex = action.coords.columnIndex;

      const result = [
                ...state.slice(0, rowIndex),
                [
                  ...state[rowIndex].slice(0, columnIndex),
                  rotateTile(state[rowIndex][columnIndex]),
                  ...state[rowIndex].slice(columnIndex + 1)
                ],
                ...state.slice(rowIndex + 1)
              ];

      return result;
    default:
      return state;
  }
}

export default level;
