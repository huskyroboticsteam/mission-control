import React from 'react'
import {selectPressedKeys} from '../../store/inputSlice.js'
import {useSelector} from 'react-redux'
import {KeyboardControls} from '../../constants/controls/keyboardControls.js'
import type {RootState} from '../../store/store.js'
import './KeyboardTable.css'

// Table for Keyboard Controls
export const KeyboardTable = () => {
  // Checking input slice to see what keys are being pressed
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
          {Object.entries(KeyboardControls).map(([key, control]) => {
            // We let the description be a function of the store for controls that change depending on the state
            // For example, whether tank drive is on or not changes what should be displayed on the help screen
            const description = useSelector((state: RootState) =>
              typeof control.description === 'function'
                ? control.description(state)
                : control.description
            )
            return (
              <tr key={key} style={{backgroundColor: keys.includes(key) ? 'yellow' : 'white'}}>
                <td>{control.display ?? key}</td>
                <td>{description}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
