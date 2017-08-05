export const nextLevel = () => {
  return {
    type: 'NEXT_LEVEL'
  }
}

export const rotateTile = (rowIndex, columnIndex) => {
  return {
    type: 'ROTATE_TILE',
    rowIndex,
    columnIndex
  }
}
