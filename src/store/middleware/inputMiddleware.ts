import {requestDrive, requestTankDrive} from '../driveSlice.js'
import {requestJointPower} from '../jointSlice.js'
import {isAnyOf, type Middleware} from '@reduxjs/toolkit'
import type {RootState, RoverDispatch, RoverStoreAPI} from '../store.js'
import {
  gamepadAxisChanged,
  gamepadButtonChanged,
  inputSlice,
  keyPressed,
  keyReleased,
} from '../inputSlice.js'
import {
  DriveGamepadControls,
  driveGamepadToAxes,
  PeripheralGamepadControls,
  peripheralGamepadToAxes,
} from '../../constants/controls/gamepadControls.js'
import {JointNames} from '../../constants/jointConstants.js'
import type {Axis, Button} from 'react-gamepad'
import {KeyboardControls, keyToAxes} from '../../constants/controls/keyboardControls.js'

/**
 * Middleware that messages the rover in response to user input.
 */
export const inputMiddleware: Middleware<{}, RootState> =
  (store: RoverStoreAPI) => (next) => (action) => {
    const prev = store.getState()
    const result = next(action)

    if (isAnyOf(...Object.values(inputSlice.actions))(action)) {
      const state = store.getState()
      switch (action.type) {
        case gamepadAxisChanged.type: {
          const {gamepadName, axisName, value} = action.payload
          if (Math.abs(prev.input[gamepadName][axisName] - value) < 0.05) {
            break
          }
          if (gamepadName === 'driveGamepad') {
            requestDriveAxisMovementFromGamepad(state, store.dispatch, axisName)
          }
          if (gamepadName === 'peripheralGamepad') {
            requestPeripheralAxisMovementFromGamepad(state, store.dispatch, axisName)
          }
          break
        }

        case gamepadButtonChanged.type: {
          const {gamepadName, buttonName, pressed} = action.payload
          if (prev.input[gamepadName][buttonName] === pressed) {
            break
          }
          if (gamepadName === 'driveGamepad') {
            const control = DriveGamepadControls[buttonName]

            if (pressed) {
              control?.onPress?.(store)
            } else {
              control?.onRelease?.(store)
            }
          }
          if (gamepadName === 'peripheralGamepad') {
            requestPeripheralAxisMovementFromGamepad(state, store.dispatch, buttonName)

            const control = PeripheralGamepadControls[buttonName]
            control?.onPress?.(store)
          }
          break
        }

        case keyPressed.type: {
          const key = action.payload.key.toUpperCase()
          if (prev.input.pressedKeys.includes(key)) {
            break
          }

          requestAxisMovement(state, store.dispatch, key)

          const control = KeyboardControls[key]
          control?.onPress?.(store)
          break
        }

        case keyReleased.type: {
          const key = action.payload.key.toUpperCase()
          if (!prev.input.pressedKeys.includes(key)) {
            break
          }

          requestAxisMovement(state, store.dispatch, key)

          const control = KeyboardControls[key]
          control?.onRelease?.(store)
          break
        }

        default:
          break
      }

      return result
    }
  }

const requestAxisMovement = (state: RootState, dispatch: RoverDispatch, key: string) => {
  // If key is changing an axis
  keyToAxes[key]?.forEach((axis) => {
    if (axis in JointNames) {
      dispatch(
        requestJointPower({
          jointName: axis as JointNames,
          power: state.input.axes[axis as JointNames],
        })
      )
      // If one key is somehow changing both axes at once, it will send the request twice
    } else if (['straight', 'steer'].includes(axis)) {
      dispatch(
        requestDrive({
          straight: state.input.axes.straight,
          steer: state.input.axes.steer,
        })
      )
    } else if (['left', 'right'].includes(axis)) {
      dispatch(
        requestTankDrive({
          left: state.input.axes.left,
          right: state.input.axes.right,
        })
      )
    }
  })
}

const requestDriveAxisMovementFromGamepad = (
  state: RootState,
  dispatch: RoverDispatch,
  gamepadAxis: Axis
) => {
  driveGamepadToAxes[gamepadAxis]?.forEach((axis) => {
    if (['straight', 'steer'].includes(axis)) {
      dispatch(
        requestDrive({
          straight: state.input.axes.straight,
          steer: state.input.axes.steer,
        })
      )
    } else if (['left', 'right'].includes(axis)) {
      dispatch(
        requestTankDrive({
          left: state.input.axes.left,
          right: state.input.axes.right,
        })
      )
    }
  })
}

const requestPeripheralAxisMovementFromGamepad = (
  state: RootState,
  dispatch: RoverDispatch,
  name: Axis | Button
) => {
  peripheralGamepadToAxes[name]?.forEach((axis) => {
    if (axis in JointNames) {
      dispatch(
        requestJointPower({
          jointName: axis as JointNames,
          power: state.input.axes[axis as JointNames],
        })
      )
    }
  })
}
