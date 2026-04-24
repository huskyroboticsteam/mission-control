import './HelpPanel.css'
import {GamepadTable} from './GamepadTable.js'
import {useEffect} from 'react'
import React from 'react'
import {
  Axes,
  Buttons,
  gamepadApiWrapper,
  GamepadIndex,
  GamepadNames,
  Gamepads,
} from '../../constants/gamepadConstants.js'
import {Gamepad} from './Gamepad.js'
import {useStore} from 'react-redux'
import type {RootState} from '../../store/store.js'
import {gamepadAxisChanged, gamepadButtonChanged} from '../../store/inputSlice.js'
import {KeyboardTable} from './KeyboardTable.js'
import { KeyboardDisplay } from './KeyboardDisplay.js'

export const HelpPanel = () => {
  const store = useStore<RootState>()

  // Adds listener for gamepad button changes + updates buttonChange state accordingly
  useEffect(() => {
    if (!gamepadApiWrapper) return

    const unsubscribeButtons = gamepadApiWrapper.onGamepadButtonChange(
      (gpadIndex, _, buttonChanges) => {
        buttonChanges.forEach((change, index) => {
          if (change) {
            if (change.pressed || change.released) {
              store.dispatch(
                gamepadButtonChanged({
                  gamepadName: Gamepads[gpadIndex],
                  buttonName: Buttons[index],
                  pressed: change.pressed ?? false,
                })
              )
            }
          }
        })
      }
    )

    const unsubscribeAxes = gamepadApiWrapper.onGamepadAxisChange(
      (gpadIndex, gpad, axisChanges) => {
        axisChanges.forEach((value, index) => {
          if (value) {
            store.dispatch(
              gamepadAxisChanged({
                gamepadName: Gamepads[gpadIndex],
                axisName: Axes[index],
                value: gpad.axes[index],
              })
            )
          }
        })
      }
    )

    // stops listening when unmounted
    return () => {
      unsubscribeButtons
      unsubscribeAxes
    }
  }, [])

  return (
    <div id="help-panel">
      <div id="top">
        <div className="gamepad-container">
          <GamepadTable gamepadName={GamepadNames.driveGamepad} />
          <div className="g1-text-wrapper">
            <b className="label">Driver Gamepad</b>
            <Gamepad index={GamepadIndex.driveGamepad} />
          </div>
        </div>
        <div className="gamepad-container">
          <GamepadTable gamepadName={GamepadNames.peripheralGamepad} />
          <div className="g2-text-wrapper">
            <b className="label">Peripheral Gamepad</b>
            <Gamepad index={GamepadIndex.peripheralGamepad} />
          </div>
        </div>
      </div>
      <div id="bot">
        <KeyboardTable />
        <div className="keyboard">
          <b className="label">Keyboard Controls</b>
          <KeyboardDisplay />
        </div>
      </div>
    </div>
  )
}
