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
          {Object.entries(KeyboardControls).map(([key, control]) => (
            <tr key={key} style={{backgroundColor: keys.includes(key) ? 'yellow' : 'white'}}>
              <td>{control.display ?? key}</td>
              <td>{resolveDescription(control, store)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
