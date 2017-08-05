// @flow
import React from 'react'
import LevelCell from './LevelCell'
import Tiles from '../global/Tiles'

import { connect } from 'react-redux'

const LevelMap = ({level}) => {
    const rowFunction = (row, rowIndex) => row.map((cell, columnIndex) => <td key={'cell_' + rowIndex + columnIndex}><LevelCell level={level} rowIndex={rowIndex} columnIndex={columnIndex}/></td>)
    const tableRows = level.map((row, rowIndex) => <tr key={'row_' + rowIndex}>{rowFunction(row, rowIndex)}</tr>)

    return (
      <table><tbody>
      { tableRows }
      </tbody></table>
    );
}

export default connect(
  state => {return {level: state.level}},
  null
)(LevelMap)
