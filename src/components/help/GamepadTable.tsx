import React from 'react'
import './GamepadTable.css'
import {GamepadControls} from '../../constants/controls/gamepadControls.js'
import {useSelector} from 'react-redux'
import type {RootState} from '../../store/store.js'
import {isButton, isInvertibleAxis, type GamepadNames} from '../../constants/gamepadConstants.js'
import {selectGamepad} from '../../store/inputSlice.js'

// Table for Gamepad Controls
export const GamepadTable = ({gamepadName}: {gamepadName: GamepadNames}) => {
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
            if (isInvertibleAxis(name)) {
              // We let the description be a function of the store for controls that change depending on the state
              // For example, whether tank drive is on or not changes what should be displayed on the help screen
              const description = useSelector((state: RootState) =>
                typeof control.description === 'function'
                  ? control.description(state)
                  : control.description
              )
              return (
                <tr
                  key={name}
                  style={{backgroundColor: Math.abs(state[name]) > 0 ? 'yellow' : 'white'}}>
                  <td>{control.display ?? name}</td>
                  <td>{description}</td>
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
              // We let the description be a function of the store for controls that change depending on the state
              // For example, whether tank drive is on or not changes what should be displayed on the help screen
              const description = useSelector((state: RootState) =>
                typeof control.description === 'function'
                  ? control.description(state)
                  : control.description
              )
              return (
                <tr key={name} style={{backgroundColor: state[name] ? 'yellow' : 'white'}}>
                  <td>{control.display ?? name}</td>
                  <td>{description}</td>
                </tr>
              )
            }
          })}
        </tbody>
      </table>
    </div>
  )
}
