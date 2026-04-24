import {
  gamepadButtonType,
  gamepadDirection,
  PRESET_SVG_GPAD_BTN_IDS,
  PRESET_SVG_GPAD_BTN_TAP_TARGET_IDS,
  PRESET_SVG_GPAD_CLASS,
  standardGpadButtonMap,
} from 'virtual-gamepad-lib/enums'
import {GamepadDisplay, type DisplayGamepadConfig} from 'virtual-gamepad-lib/GamepadDisplay'
import {CenterTransformOrigin} from 'virtual-gamepad-lib/utilities'
import {gamepadApiWrapper, gamepadEmulator} from '../constants/gamepadConstants.js'
import type {
  ButtonTouchConfig,
  VariableButtonTouchConfig,
} from 'virtual-gamepad-lib/GamepadEmulator'

// From Virtual Gamepad Library - sets up input for buttons and joystick
export const setupEmulatedGamepadInput = (gpadIndex: number, display_gpad: HTMLElement) => {
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
          tapTarget: display_gpad.querySelector('#' + tapTargetId) as HTMLElement,
          dragDistance: 50, // pixels that the user must drag the button down to fully press it.
          lockTargetWhilePressed: true,
          directions: {
            [gamepadDirection.up]: false,
            [gamepadDirection.down]: true,
            [gamepadDirection.left]: false,
            [gamepadDirection.right]: false,
          },
        } as VariableButtonTouchConfig
      } else {
        return {
          buttonIndex: i,
          type: gamepadButtonType.onOff,
          lockTargetWhilePressed: isStick === true,
          tapTarget: display_gpad.querySelector('#' + tapTargetId),
        } as ButtonTouchConfig
      }
    })
  )
  // Joystick inputs
  gamepadEmulator.AddJoystickTouchEventListeners(gpadIndex, [
    {
      // Left joystick
      tapTarget: display_gpad.querySelector(
        '#' + PRESET_SVG_GPAD_BTN_TAP_TARGET_IDS[standardGpadButtonMap.LStick]
      )!,
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
      )!,
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
export const addGamepadDisplay = (gpadIndex: number, display_gpad: HTMLElement) => {
  // Add a copy of the gamepad display to the page
  const leftStickButton = document.querySelector(
    `#${PRESET_SVG_GPAD_BTN_IDS[standardGpadButtonMap.LStick]}`
  ) as SVGGraphicsElement
  const rightStickButton = document.querySelector(
    `#${PRESET_SVG_GPAD_BTN_IDS[standardGpadButtonMap.RStick]}`
  ) as SVGGraphicsElement
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
    } as DisplayGamepadConfig,
    gamepadApiWrapper
  ) // we can pass our existing instance of the gpadApiWrapper to the gamepad display so that it can use it to update the gamepad state efficiently.
}
