export const nextLevel = () => {
  return {
    type: 'NEXT_LEVEL'
  }
}

export const rotateTile = (coords) => {
  return {
    type: 'ROTATE_TILE',
    coords
  }
}
