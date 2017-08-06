const Sides = Object.freeze({
  UP: 0b1000,
  RIGHT: 0b0100,
  DOWN: 0b0010,
  LEFT: 0b0001
})

const Tiles = Object.freeze([
  [0],
  [0b1000, 0b0100, 0b0010, 0b0001],
  [0b1100, 0b0110, 0b0011, 0b1001],
  [0b1110, 0b0111, 0b1011, 0b1101],
  [0b1111],
  [0b1010, 0b0101],
])

const bitsSet = i => {
  var bits = 0;
  for (var m = 1; m < 16; m <<= 1)
    bits += i & m ? 1 : 0;
  return bits;
}

const getTileSet = tile => {
  if ((tile == 0b1010) || (tile == 0b0101))
    return 4;

  return bitsSet(tile);
}

const rotateTile = tile => (tile >> 1 | ((tile & 1) << 3));

export { Sides, Tiles, getTileSet, rotateTile }
export default Tiles
