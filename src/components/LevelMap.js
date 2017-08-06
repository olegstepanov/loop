// @flow
import React from 'react'
import LevelCell from './LevelCell'
import Tiles from '../global/Tiles'

import { connect } from 'react-redux'

const LevelMap = ({level}) => {
    const map = level.map;
    const rowFunction = (row, rowIndex) => row.map((cell, columnIndex) => <div className="levelmap_cell" key={'cell_' + rowIndex + columnIndex}><LevelCell cell={map[rowIndex][columnIndex]} coords={{rowIndex, columnIndex}}/></div>)
    const tableRows = map.map((row, rowIndex) => <div className="levelmap_row" key={'row_' + rowIndex}>{rowFunction(row, rowIndex)}</div>)

    return (
      <div className="levelmap" cellSpacing="0">
      { tableRows }
      </div>
    );
}

export default connect(
  state => {return {level: state.level}},
  null
)(LevelMap)
