import React from 'react'
import PropTypes from 'prop-types'
import { Sides, Tiles } from '../global/Tiles'
import { rotateTile } from '../actions'
import { connect } from 'react-redux'

const containsDirections = (tile, directions) => {
  for (var dir of directions)
    if (tile.indexOf(dir) < 0)
      return false;
  return true;
}

const LevelCell = ({level, rowIndex, columnIndex, onTileClicked}) => {
  const cell = level[rowIndex][columnIndex];
  const tile = Tiles[cell.tileSet][cell.index];

  const style = {
    size: 30
  }

  const svgStyle = {
    stroke: 'black',
    fill: 'none'
  };

  var circles = [];

  if (containsDirections(tile, [Sides.UP, Sides.RIGHT]))
    circles = [...circles, {cx: 1, cy: 0}];
  if (containsDirections(tile, [Sides.RIGHT, Sides.DOWN]))
    circles = [...circles, {cx: 1, cy: 1}];
  if (containsDirections(tile, [Sides.DOWN, Sides.LEFT]))
    circles = [...circles, {cx: 0, cy: 1}];
  if (containsDirections(tile, [Sides.LEFT, Sides.UP]))
    circles = [...circles, {cx: 0, cy: 0}];

  const svgCircles = circles.map((circle, index) => {
    return (<circle key={index} cx={circle.cx * style.size} cy={circle.cy * style.size} r={style.size / 2} style={svgStyle} />);
  })

  return (
      <svg width={style.size} height={style.size } onClick={() => onTileClicked(rowIndex, columnIndex)}>
        {svgCircles}
      </svg>
  );
}

export default connect(
  (state, ownProps) => { return {level: state.level, ...ownProps}; },
  dispatch => { return {
    onTileClicked: (rowIndex, columnIndex) => dispatch(rotateTile(rowIndex, columnIndex))
  }; }
)(LevelCell);
