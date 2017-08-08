import React from 'react'
import PropTypes from 'prop-types'
import { Sides, Tiles, getTileSet } from '../global/Tiles'
import { rotateTile, nextLevel } from '../actions'
import { connect } from 'react-redux'
import { isConnected } from '../global/levelGenerator'
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
    this.lastUsedRotationClass = -1;
  }

  render() {
    const {cell, coords, hasRotated, onTileClicked} = this.props;

    const cellid = coords.rowIndex + '_' + coords.columnIndex;
    const tileSet = getTileSet(cell);
    const baseTile = Tiles[tileSet][0];
    const baseStrokeWidth = 5;
    const outerStrokeWidth = 1;

    var rotationClass = Tiles[tileSet].indexOf(cell);
    if (hasRotated && (rotationClass == this.lastUsedRotationClass))
      rotationClass = (rotationClass + 1) % 4;
    this.lastUsedRotationClass = rotationClass;

    var styles = {
      size: 50,
      div: {
        animationName: 'rotatedTile' + rotationClass
      }
    }

    var content = {};
    var circles = [];

    if ((baseTile & (Sides.UP | Sides.RIGHT)) == (Sides.UP | Sides.RIGHT))
      circles = [...circles, {cx: 1, cy: 0}];
    if ((baseTile & (Sides.RIGHT | Sides.DOWN)) == (Sides.RIGHT | Sides.DOWN))
      circles = [...circles, {cx: 1, cy: 1}];
    if ((baseTile & (Sides.DOWN | Sides.LEFT)) == (Sides.DOWN | Sides.LEFT))
      circles = [...circles, {cx: 0, cy: 1}];
    if ((baseTile & (Sides.LEFT | Sides.UP)) == (Sides.LEFT | Sides.UP))
      circles = [...circles, {cx: 0, cy: 0}];

    if (circles.length == 0) {
      if (baseTile == Sides.UP) {
        const maskId = 'mask' + cellid;
        const ringRadius = styles.size / 4;
        content = (
          <g>
            <mask id={maskId}>
              <rect width="100%" height="100%" fill="white" />
              <circle cx={styles.size / 2} cy={styles.size / 2} r={ringRadius - baseStrokeWidth / 2} fill="black" />
            </mask>
            <circle cx={styles.size / 2} cy={styles.size / 2} r={ringRadius + baseStrokeWidth / 2} mask={'url(#' + maskId + ')'} />
            <rect x={styles.size / 2 - baseStrokeWidth / 2} width={baseStrokeWidth} y={0} height={styles.size / 2 - ringRadius} />
          </g>
        );
      } else if (baseTile == (Sides.UP | Sides.DOWN)) {
        content = (
          <rect x={styles.size / 2 - baseStrokeWidth / 2} width={baseStrokeWidth} y={0} height={styles.size} />
        )
      } else if (baseTile == (Sides.LEFT | Sides.RIGHT)) {
        content = (
          <rect x={0} y={styles.size / 2 - baseStrokeWidth / 2} width={styles.size} height={baseStrokeWidth} />
        )
      } else if (baseTile == 0) {
        content = (<g></g>)
      }
      else throw new Error("Here we have a shortcut assuming that the base tile for single-leg tile looks up")
    }
    else {
      content = circles.map((circle, index) => {
        const maskId = 'mask' + cellid + '_' + index;
        var nextCircleSvg = (<g/>);

        if (index < circles.length - 1) {
          const nextCircle = circles[index + 1];

          nextCircleSvg = (
            <g>
              <circle cx={nextCircle.cx * styles.size} cy={nextCircle.cy * styles.size} r={styles.size / 2 + baseStrokeWidth / 2 + 2} fill='black' />
              <circle cx={nextCircle.cx * styles.size} cy={nextCircle.cy * styles.size} r={styles.size / 2 + baseStrokeWidth / 2} fill='white' />
            </g>
          );
        }

        return (
          <g key={index}>
            <mask id={maskId}>
              <rect width="100%" height="100%" fill="white" />
              {nextCircleSvg}
              <circle cx={circle.cx * styles.size} cy={circle.cy * styles.size} r={styles.size / 2 - baseStrokeWidth / 2} fill='black' />
            </mask>

            <circle cx={circle.cx * styles.size} cy={circle.cy * styles.size} r={styles.size / 2 + baseStrokeWidth / 2} style={styles.stroke} mask={'url(#' + maskId + ')'} />
          </g>
        );
      })
    }

    const className = hasRotated ? 'rotatedTile' : 'staticTile';
    return (
      <div className={className} style={styles.div}>
        <svg width={styles.size} height={styles.size } preserveAspectRatio="xMinYMin meet" onClick={() => onTileClicked(coords)}>
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
  (dispatch) => ({dispatch}),
  (stateProps, {dispatch}, ownProps) => {
    return {
      ...ownProps,
      ...stateProps,
      onTileClicked: (coords) => {
        if (!isConnected(stateProps.level.map))
          dispatch(rotateTile(coords));
      }
    }
  },
)(LevelCell);
