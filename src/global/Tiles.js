const Sides = Object.freeze({
  UP: "UP",
  RIGHT: "RIGHT",
  DOWN: "DOWN",
  LEFT: "LEFT"
})

const Tiles = Object.freeze([
  [Sides.UP + Sides.RIGHT, Sides.RIGHT + Sides.DOWN, Sides.DOWN + Sides.LEFT, Sides.LEFT + Sides.UP],
  [Sides.UP + Sides.RIGHT + Sides.DOWN, Sides.RIGHT + Sides.DOWN + Sides.LEFT, Sides.DOWN + Sides.LEFT + Sides.UP, Sides.LEFT + Sides.UP + Sides.RIGHT],
  [Sides.UP + Sides.RIGHT + Sides.DOWN + Sides.LEFT]
])

export { Sides, Tiles }
export default Tiles
