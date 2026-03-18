import './HelpPanel.css'
import {KeyboardTable} from './KeyboardTable.js'
import {Keyboard} from './Keyboard.js'
import GamepadTable from './GamepadTable.js'
import {type EGamepad} from 'virtual-gamepad-lib/GamepadEmulator'
import {type buttonChangeDetails} from 'virtual-gamepad-lib/GamepadApiWrapper'
import {useState, useRef, useEffect} from 'react'
import FULL_GPAD_SVG_SOURCE_CODE from 'virtual-gamepad-lib/gamepad_assets/rounded/display-gamepad-full.svg?raw'
import React from 'react'
import {gamepadApiWrapper, gamepadEmulator} from '../../constants/gamepadConstants.js'
import {addGamepadDisplay, setupEmulatedGamepadInput} from '../../util/gamepads.js'

export const HelpPanel = () => {
  const displayGpad1 = useRef<HTMLDivElement>(null)
  const displayGpad2 = useRef<HTMLDivElement>(null)
  const [buttonChange, setButtonChange] = useState<{
    gpadIndex: number
    gpad: EGamepad | Gamepad
    buttonChanges: readonly (false | buttonChangeDetails)[]
  } | null>(null)
  const [axisChange, setAxisChange] = useState<{
    gpadIndex: number
    gpad: EGamepad | Gamepad
    axisChangesMask: readonly boolean[]
  } | null>(null)

  // Sets up the emulated gamepads on page load
  useEffect(() => {
    gamepadEmulator.AddEmulatedGamepad(0, true, 18, 4) // returns the new (emulated) gamepad or false if some error happened.
    gamepadEmulator.AddEmulatedGamepad(1, true, 18, 4) // returns the new (emulated) gamepad or false if some error happened.
    addGamepadDisplay(0, displayGpad1.current!)
    addGamepadDisplay(1, displayGpad2.current!)
    setupEmulatedGamepadInput(0, displayGpad1.current!)
    setupEmulatedGamepadInput(1, displayGpad2.current!)

    return () => {
      gamepadEmulator.RemoveEmulatedGamepad(0)
      gamepadEmulator.RemoveEmulatedGamepad(1)
    }
  }, [])

  // Adds listener for gamepad button changes + updates buttonChange state accordingly
  useEffect(() => {
    if (!gamepadApiWrapper) return

    const unsubscribe = gamepadApiWrapper.onGamepadButtonChange(
      (gpadIndex, gpad, buttonChanges) => {
        setButtonChange({
          gpadIndex,
          gpad,
          buttonChanges,
        })
      }
    )

    // stops listening when unmounted
    return () => {
      unsubscribe
    }
  }, [])

  // Adds listener for gamepad axis changes + updates axisChange state accordingly
  useEffect(() => {
    if (!gamepadApiWrapper) return

    const unsubscribe = gamepadApiWrapper.onGamepadAxisChange(
      (gpadIndex, gpad, axisChangesMask) => {
        setAxisChange({
          gpadIndex,
          gpad,
          axisChangesMask,
        })
      }
    )

    // stops listening when unmounted
    return () => {
      unsubscribe
    }
  }, [])

  return (
    <div className="help-panel">
      <div className="top">
        <div className="g1">
          <GamepadTable gpadButton={buttonChange?.gpad} gpadAxis={axisChange?.gpad} gpadIndex={0} />
          <div className="g1-text-wrapper">
            <b className="label">Driver Gamepad</b>
            <div
              className="gamepad-1"
              ref={displayGpad1}
              dangerouslySetInnerHTML={{__html: FULL_GPAD_SVG_SOURCE_CODE}}></div>
          </div>
        </div>
        <div className="g2">
          <GamepadTable gpadButton={buttonChange?.gpad} gpadAxis={axisChange?.gpad} gpadIndex={1} />
          <div className="g2-text-wrapper">
            <b className="label">Peripheral Gamepad</b>
            <div
              className="gamepad-2"
              ref={displayGpad2}
              dangerouslySetInnerHTML={{__html: FULL_GPAD_SVG_SOURCE_CODE}}></div>
          </div>
        </div>
      </div>
      <div className="bot">
        <div className="keyboard-T">
          <KeyboardTable />
        </div>
        <div className="keyboard">
          <b className="label">Keyboard Controls</b>
          <Keyboard />
        </div>
      </div>
    </div>
  )
}
