import './HelpPanel.css'
import KeyboardTable from './KeyboardTable.jsx'
import Table from './Table.jsx'
import {GamepadEmulator} from 'virtual-gamepad-lib/GamepadEmulator'
import {GamepadApiWrapper} from 'virtual-gamepad-lib/GamepadApiWrapper'
import {useState, useRef, useEffect} from 'react'
import FULL_GPAD_SVG_SOURCE_CODE from 'virtual-gamepad-lib/gamepad_assets/rounded/display-gamepad-full.svg?raw'
import {CenterTransformOrigin} from 'virtual-gamepad-lib/utilities'
import {GamepadDisplay} from 'virtual-gamepad-lib/GamepadDisplay'
import {
  gamepadButtonType,
  gamepadDirection,
  PRESET_SVG_GPAD_BTN_IDS,
  PRESET_SVG_GPAD_BTN_TAP_TARGET_IDS,
  PRESET_SVG_GPAD_CLASS,
  standardGpadButtonMap,
} from 'virtual-gamepad-lib/enums'
import KeyboardDisplay from './KeyboardDisplay.jsx'

const gamepadEmulator = new GamepadEmulator(0.1)
const gamepadApiWrapper = new GamepadApiWrapper({
  buttonConfigs: [],
  updateDelay: 0,
  axisDeadZone: 0.05,
})

// From Virtual Gamepad Library - sets up input for buttons and joystick
function setupEmulatedGamepadInput(gpadIndex, display_gpad) {
  gamepadEmulator.AddButtonTouchEventListeners(
    gpadIndex,
    PRESET_SVG_GPAD_BTN_TAP_TARGET_IDS.map((tapTargetId, i) => {
      const isTrigger = tapTargetId.includes('trigger')
      const isStick = tapTargetId.includes('stick')
      //Trigger Inputs
      if (isTrigger) {
        return {
          buttonIndex: i,
          type: gamepadButtonType.variable,
          tapTarget: display_gpad.querySelector('#' + tapTargetId),
          dragDistance: 50, // pixels that the user must drag the button down to fully press it.
          lockTargetWhilePressed: true,
          directions: {
            [gamepadDirection.up]: false,
            [gamepadDirection.down]: true,
            [gamepadDirection.left]: false,
            [gamepadDirection.right]: false,
          },
        }
      } else {
        return {
          buttonIndex: i,
          type: gamepadButtonType.onOff,
          lockTargetWhilePressed: isStick === true,
          tapTarget: display_gpad.querySelector('#' + tapTargetId),
        }
      }
    })
  )
  // Joystick inputs
  gamepadEmulator.AddJoystickTouchEventListeners(gpadIndex, [
    {
      // Left joystick
      tapTarget: display_gpad.querySelector(
        '#' + PRESET_SVG_GPAD_BTN_TAP_TARGET_IDS[standardGpadButtonMap.LStick]
      ),
      dragDistance: 30, // pixels that the user must drag the joystic to represent + 1 (or in reverse to represent minus one).
      xAxisIndex: 0,
      yAxisIndex: 1,
      lockTargetWhilePressed: true,
      directions: {
        [gamepadDirection.up]: true,
        [gamepadDirection.down]: true,
        [gamepadDirection.left]: true,
        [gamepadDirection.right]: true,
      },
    },
    {
      // Right joystick
      tapTarget: display_gpad.querySelector(
        '#' + PRESET_SVG_GPAD_BTN_TAP_TARGET_IDS[standardGpadButtonMap.RStick]
      ),
      dragDistance: 30, // pixels that the user must drag the joystic to represent + 1 (or in reverse to represent minus one).
      xAxisIndex: 2,
      yAxisIndex: 3,
      lockTargetWhilePressed: true,
      directions: {
        [gamepadDirection.up]: true,
        [gamepadDirection.down]: true,
        [gamepadDirection.left]: true,
        [gamepadDirection.right]: true,
      },
    },
  ])
}
// From Virtual Gamepad Lib - connects display buttons/axes of onscreen gamepad to gamepadapi
function addGamepadDisplay(gpadIndex, display_gpad) {
  // Add a copy of the gamepad display to the page
  const leftStickButton = document.querySelector(
    `#${PRESET_SVG_GPAD_BTN_IDS[standardGpadButtonMap.LStick]}`
  )
  const rightStickButton = document.querySelector(
    `#${PRESET_SVG_GPAD_BTN_IDS[standardGpadButtonMap.RStick]}`
  )
  CenterTransformOrigin(leftStickButton)
  CenterTransformOrigin(rightStickButton)
  // Button Display Config
  const buttons = PRESET_SVG_GPAD_BTN_IDS.map((btnId) => {
    const isTrigger = btnId.includes('trigger')
    if (isTrigger) {
      // trigger buttons usually take variable pressure so can be represented by a variable button that is dragged down.
      return {
        type: gamepadButtonType.variable,
        direction: gamepadDirection.down,
        buttonElement: display_gpad.querySelector(`#${btnId}`),
        highlight: display_gpad.querySelector(
          `#${btnId} .${PRESET_SVG_GPAD_CLASS.ButtonHighlight}`
        ),
        directionHighlight: display_gpad.querySelector(
          `#${btnId} .${PRESET_SVG_GPAD_CLASS.DirectionHighlight}`
        ),
        movementRange: 10, // pixels that the button can move
      }
    } else {
      // all other buttons are simply on (pressed) or off (not pressed).
      return {
        type: gamepadButtonType.onOff,
        highlight: display_gpad.querySelector(
          `#${btnId} .${PRESET_SVG_GPAD_CLASS.ButtonHighlight}`
        ),
      }
    }
  })

  // Joystick Display Config
  const joysticks = [
    {
      joystickElement: display_gpad.querySelector(
        `#${PRESET_SVG_GPAD_BTN_IDS[standardGpadButtonMap.LStick]}`
      ),
      xAxisIndex: 0,
      yAxisIndex: 1,
      movementRange: 10,
    },
    {
      joystickElement: display_gpad.querySelector(
        `#${PRESET_SVG_GPAD_BTN_IDS[standardGpadButtonMap.RStick]}`
      ),
      xAxisIndex: 2,
      yAxisIndex: 3,
      movementRange: 10,
    },
  ]
  // create the gamepad display class instance and pass the button and joystick configs
  const display = new GamepadDisplay(
    {
      gamepadIndex: gpadIndex,
      buttons: buttons,
      sticks: joysticks,
    },
    gamepadApiWrapper
  ) // we can pass our existing instance of the gpadApiWrapper to the gamepad display so that it can use it to update the gamepad state efficiently.
}

function HelpPanel() {
  const [tankDriveEnabled, setTankDriveEnabled] = useState(false)
  const displayGpad1 = useRef(null)
  const displayGpad2 = useRef(null)
  const [buttonChange, setButtonChange] = useState(null)
  const [axisChange, setAxisChange] = useState(null)

  // Sets up the emulated gamepads on page load
  useEffect(() => {
    gamepadEmulator.AddEmulatedGamepad(0, true, 18, 4) // returns the new (emulated) gamepad or false if some error happened.
    gamepadEmulator.AddEmulatedGamepad(1, true, 18, 4) // returns the new (emulated) gamepad or false if some error happened.
    addGamepadDisplay(0, displayGpad1.current)
    addGamepadDisplay(1, displayGpad2.current)
    setupEmulatedGamepadInput(0, displayGpad1.current)
    setupEmulatedGamepadInput(1, displayGpad2.current)
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
      unsubscribe?.()
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
      unsubscribe?.()
    }
  }, [])

  return (
    <div className="help-panel">
      <div className="top">
        <div className="g1">
          <Table
            gpadButton={buttonChange?.gpad}
            gpadAxis={axisChange?.gpad}
            gpadIndex={0}
            tankDriveEnabled={tankDriveEnabled}
            setTankDriveEnabled={setTankDriveEnabled}
          />
          <div className="g1-text-wrapper">
            <b className="label">Driver Gamepad</b>
            <div
              className="gamepad-1"
              ref={displayGpad1}
              dangerouslySetInnerHTML={{__html: FULL_GPAD_SVG_SOURCE_CODE}}></div>
          </div>
        </div>
        <div className="g2">
          <Table gpadButton={buttonChange?.gpad} gpadAxis={axisChange?.gpad} gpadIndex={1} />
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
          <KeyboardTable
            tankDriveEnabled={tankDriveEnabled}
            setTankDriveEnabled={setTankDriveEnabled}
          />
        </div>
        <div className="keyboard">
          <b className="label">Keyboard Controls</b>
          <KeyboardDisplay />
        </div>
      </div>
    </div>
  )
}

export default HelpPanel
