import React from 'react'
import './GamepadTable.css'
import {
  GamepadControls,
  resolveDescription,
} from '../../constants/controls.js'
import {useSelector, useStore} from 'react-redux'
import type {RootState} from '../../store/store.js'
import {isAxis, isButton, type GamepadNames} from '../../constants/gamepadConstants.js'
import {selectGamepad} from '../../store/inputSlice.js'

// Table for Gamepad Controls
export const GamepadTable = ({gamepadName}: {gamepadName: GamepadNames}) => {
  const store = useStore<RootState>()
  const state = useSelector(selectGamepad(gamepadName))

  return (
    <div id="gpad-table-container">
      <table id="axis-table">
        <thead>
          <tr>
            <th>Axis</th>
            <th>Action</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(GamepadControls[gamepadName]).map(([name, control]) => {
            if (isAxis(name)) {
              return (
                <tr key={name}>
                  <td>{control.display ?? name}</td>
                  <td>{resolveDescription(control, store)}</td>
                  <td>{state[name].toFixed(2)}</td>
                </tr>
              )
            }
          })}
        </tbody>
      </table>

      <table id="button-table">
        <thead>
          <tr>
            <th>Button</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody className="button-table">
          {Object.entries(GamepadControls[gamepadName]).map(([name, control]) => {
            if (isButton(name)) {
              return (
                <tr key={name} style={{backgroundColor: state[name] ? 'yellow' : 'white'}}>
                  <td>{control.display ?? name}</td>
                  <td>{resolveDescription(control, store)}</td>
                </tr>
              )
            }
          })}
        </tbody>
      </table>
    </div>
  )
}
