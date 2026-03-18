import React from 'react'
import {selectPressedKeys} from '../../store/inputSlice.js'
import {useSelector, useStore} from 'react-redux'
import {KeyboardControls, resolveDescription} from '../../constants/controls.js'
import type {RootState} from '../../store/store.js'
import './KeyboardTable.css'

// Table for Keyboard Controls
export const KeyboardTable = () => {
  // Checking input slice to see what keys are being pressed
  const store = useStore<RootState>()
  const keys = useSelector(selectPressedKeys)

  return (
    <div id="keyboard-table-container">
      <table id="keyboard-table">
        <thead>
          <tr>
            <th>Key</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody className="keyboard-table">
          {Object.entries(KeyboardControls).map((entry) => (
            <tr
              key={entry[0]}
              style={{backgroundColor: keys.includes(entry[0]) ? 'yellow' : 'white'}}>
              <td>{entry[1].display ? entry[1].display : entry[0]}</td>
              <td>{resolveDescription(entry[1], store)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
