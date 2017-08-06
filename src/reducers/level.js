import { combineReducers } from 'redux';
import { Tiles, rotateTile } from '../global/Tiles'
import { levelGenerator, isConnected } from '../global/levelGenerator'

const pickRandomTile = () => {
  const tileSet = Math.floor(Math.random() * Tiles.length);
  const index = Math.floor(Math.random() * Tiles[tileSet].length);

  return { tileSet, index };
}

const generateLevel = size => {
  const level = levelGenerator(size, size);
  if (level == null)
    console.error("Could not generate connected level");
  return level;
}

const level = (state = {map: []}, action) => {
  switch (action.type) {
    case 'NEXT_LEVEL': return { map: generateLevel(action.size) };
    case 'ROTATE_TILE':
      const rowIndex = action.coords.rowIndex;
      const columnIndex = action.coords.columnIndex;
      const map = state.map;
      const newMap = [
                ...map.slice(0, rowIndex),
                [
                  ...map[rowIndex].slice(0, columnIndex),
                  rotateTile(map[rowIndex][columnIndex]),
                  ...map[rowIndex].slice(columnIndex + 1)
                ],
                ...map.slice(rowIndex + 1)
              ];

      return {...state, map: newMap};
    default:
      return state;
  }
}

export default level;
