import { combineReducers } from 'redux';
import Tiles from '../global/Tiles'

const pickRandomTile = () => {
  const tileSet = Math.floor(Math.random() * Tiles.length);
  const index = Math.floor(Math.random() * Tiles[tileSet].length);

  return { tileSet, index };
}

const level = (state = [], action) => {
  switch (action.type) {
    case 'NEXT_LEVEL':
      const level = Array(5).fill().map(_ =>
        Array(5).fill().map(_ => pickRandomTile())
      );
      level[0][0] = { tileSet: 0, index: 0 };
      return level;
    case 'ROTATE_TILE':
      const rowIndex = action.coords.rowIndex;
      const columnIndex = action.coords.columnIndex;

      const result = [
                ...state.slice(0, rowIndex),
                [
                  ...state[rowIndex].slice(0, columnIndex),
                  {
                    ...state[rowIndex][columnIndex],
                    index: (state[rowIndex][columnIndex].index + 1) % 4
                  },
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
