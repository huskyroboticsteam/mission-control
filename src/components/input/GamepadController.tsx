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
        onAxisChange={(axisName: Axis, value: number) =>
          dispatch(
            gamepadAxisChanged({
              gamepadName,
              axisName,
              value,
            })
          )
        }
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
