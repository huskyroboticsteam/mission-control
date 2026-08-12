import Gamepad, {type Axis, type Button, type Layout} from 'react-gamepad'
import {useDispatch} from 'react-redux'
import {
  gamepadConnected,
  gamepadDisconnected,
  gamepadAxisChanged,
  gamepadButtonChanged,
} from '../../store/inputSlice.js'
import type {GamepadNames} from '../../constants/gamepadConstants.js'
import React from 'react'
import {isLinux} from '../../util/isLinux.js'

const crossPlatformLayout: Layout = {
  buttons: [
    'A',
    'B',
    'X',
    'Y',
    'LB',
    'RB',
    'LT',
    'RT',
    'Back',
    'Start',
    'LS',
    'RS',
    'DPadUp',
    'DPadDown',
    'DPadLeft',
    'DPadRight',
  ],
  axis: ['LeftStickX', 'LeftStickY', 'RightStickX', 'RightStickY', 'LeftTrigger', 'RightTrigger'],
  buttonAxis: [null, null, null, null, null, null, 'LeftTrigger', 'RightTrigger'],
}

// TODO: this is wack
const GamepadComponent = Gamepad as unknown as React.FC<Gamepad.Props>

export const GamepadController = ({
  gamepadName,
  gamepadIndex,
}: {
  gamepadName: keyof typeof GamepadNames
  gamepadIndex: number
}) => {
  const dispatch = useDispatch()

  return (
    <>
      <GamepadComponent
        layout={crossPlatformLayout}
        gamepadIndex={gamepadIndex}
        deadZone={0.05}
        onConnect={() => dispatch(gamepadConnected({gamepadName}))}
        onDisconnect={() => dispatch(gamepadDisconnected({gamepadName}))}
        // Move axis modification to the gamepad controller itself, so there is no discrepancy between slice and middleware
        onAxisChange={(axisName: Axis, value: number) => {
          let scaledValue = value

          // linux maps dpad to axes, so map them to buttons
          // also rescale triggers from [-1,1] -> [0,1], if necessary
          if (isLinux() && (axisName === 'LeftTrigger' || axisName === 'RightTrigger')) {
            // bug in linux, trigger values keep jumping to 0.
            // Rejecting this is ok, since it'll never be *exactly* zero, since that's halfway-pressed
            if (value !== 0.0) {
              scaledValue = (value + 1) / 2.0
            }
          } else {
            // Analog stick input squaring
            scaledValue = value * Math.abs(value)
          }

          // Deadzoning
          if (Math.abs(scaledValue) < 0.05 || Math.abs(scaledValue) > 0.95) {
            scaledValue = Math.round(scaledValue)
          }

          dispatch(
            gamepadAxisChanged({
              gamepadName,
              axisName,
              value: scaledValue,
            })
          )
        }}
        onButtonChange={(buttonName: Button, pressed: boolean) =>
          dispatch(
            gamepadButtonChanged({
              gamepadName,
              buttonName,
              pressed,
            })
          )
        }>
        {/* Due to a bug in react-gamepad, we must supply a child component. */}
        <></>
      </GamepadComponent>
    </>
  )
}
