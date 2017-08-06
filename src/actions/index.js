export const nextLevel = () => {
  return {
    type: 'NEXT_LEVEL',
    size: 8
  }
}

export const rotateTile = (coords) => {
  return {
    type: 'ROTATE_TILE',
    coords
  }
}
