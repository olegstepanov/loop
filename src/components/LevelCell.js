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
      stroke: {
        stroke: 'black',
        fill: 'none'
      },
      div: {
        animationName: 'rotatedTile' + cell.index
      }
    }

    var content = {};
    var circles = [];

    if (containsDirections(baseTile, [Sides.UP, Sides.RIGHT]))
      circles = [...circles, {cx: 1, cy: 0}];
    if (containsDirections(baseTile, [Sides.RIGHT, Sides.DOWN]))
      circles = [...circles, {cx: 1, cy: 1}];
    if (containsDirections(baseTile, [Sides.DOWN, Sides.LEFT]))
      circles = [...circles, {cx: 0, cy: 1}];
    if (containsDirections(baseTile, [Sides.LEFT, Sides.UP]))
      circles = [...circles, {cx: 0, cy: 0}];

    if (circles.length == 0) {
      if (containsDirections(baseTile, [Sides.UP])) {
        content = (
          <g>
            <circle cx={styles.size / 2} cy={styles.size / 2} r={styles.size / 5} style={styles.stroke} />
            <line x1={styles.size / 2} y1={styles.size * (1/2 - 1/5)} x2={styles.size / 2} y2={0} style={styles.stroke} />
          </g>
        );
      } else throw new Error("Here we have a shortcut assuming that the base tile for single-leg tile looks up")
    }
    else {
      content = circles.map((circle, index) => {
        return (<circle key={index} cx={circle.cx * styles.size} cy={circle.cy * styles.size} r={styles.size / 2} style={styles.stroke} />);
      })
    }

    const className = hasRotated ? 'rotatedTile' : 'staticTile';
    return (
      <div className={className} style={styles.div}>
        <svg width={styles.size} height={styles.size } onClick={() => onTileClicked(coords)}>
          {content}
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
