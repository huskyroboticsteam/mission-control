import React, {useEffect, useRef} from 'react'
import FULL_GPAD_SVG_SOURCE_CODE from './GamepadSVG.svg?raw'
import {Axes, Buttons, gamepadEmulator} from '../../constants/gamepadConstants.js'
import {addGamepadDisplay, setupEmulatedGamepadInput} from '../../util/gamepads.js'

export const Gamepad = ({index}: {index: number}) => {
  const gamepadDisplay = useRef<HTMLDivElement>(null)

  useEffect(() => {
    gamepadEmulator.AddEmulatedGamepad(index, true, Buttons.length, Axes.length)
    addGamepadDisplay(index, gamepadDisplay.current!)
    setupEmulatedGamepadInput(index, gamepadDisplay.current!)

    return () => {
      gamepadEmulator.RemoveEmulatedGamepad(index)
    }
  }, [])

  return (
    <div
      className="gamepad"
      ref={gamepadDisplay}
      dangerouslySetInnerHTML={{__html: FULL_GPAD_SVG_SOURCE_CODE}}
    />
  )
}
