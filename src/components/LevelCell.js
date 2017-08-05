import React from 'react'
import PropTypes from 'prop-types'
import { Sides, Tiles } from '../global/Tiles'
import { rotateTile } from '../actions'
import { connect } from 'react-redux'
import _ from 'lodash'

const containsDirections = (tile, directions) => {
  for (var dir of directions)
    if (tile.indexOf(dir) < 0)
      return false;
  return true;
}

class LevelCell extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {cell, coords, hasRotated, onTileClicked} = this.props;

    const baseTile = Tiles[cell.tileSet][0];
    const tile = Tiles[cell.tileSet][cell.index];

    var styles = {
      size: 30,
      circle: {
        stroke: 'black',
        fill: 'none'
      },
      div: {
        animationName: 'rotatedTile' + cell.index
      }
    }

    var circles = [];

    if (containsDirections(baseTile, [Sides.UP, Sides.RIGHT]))
      circles = [...circles, {cx: 1, cy: 0}];
    if (containsDirections(baseTile, [Sides.RIGHT, Sides.DOWN]))
      circles = [...circles, {cx: 1, cy: 1}];
    if (containsDirections(baseTile, [Sides.DOWN, Sides.LEFT]))
      circles = [...circles, {cx: 0, cy: 1}];
    if (containsDirections(baseTile, [Sides.LEFT, Sides.UP]))
      circles = [...circles, {cx: 0, cy: 0}];

    const className = hasRotated ? 'rotatedTile' : 'staticTile';

    const svgCircles = circles.map((circle, index) => {
      return (<circle key={index} cx={circle.cx * styles.size} cy={circle.cy * styles.size} r={styles.size / 2} style={styles.circle} />);
    })

    return (
      <div className={className} style={styles.div}>
        <svg width={styles.size} height={styles.size } onClick={() => onTileClicked(coords)}>
          {svgCircles}
        </svg>
      </div>
    );
  }
}

const hasRotated = (state, ownProps) => {
  if (state.lastAction && state.lastAction.type === 'ROTATE_TILE'){
    return _.isEqual(state.lastAction.coords, ownProps.coords);
  }

  return false;
}

export default connect(
  (state, ownProps) => { return {level: state.level, hasRotated: hasRotated(state, ownProps), ...ownProps}; },
  dispatch => { return {
    onTileClicked: (coords) => dispatch(rotateTile(coords))
  }; }
)(LevelCell);
