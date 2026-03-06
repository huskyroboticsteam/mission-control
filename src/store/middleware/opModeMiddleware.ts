import {roverConnected, messageRover} from '../roverSocketSlice.js'
import {requestOpMode} from '../opModeSlice.js'
import type {Middleware} from '@reduxjs/toolkit'
import type {RootState} from '../store.js'

/**
 * Middleware that handles sending messages to the rover to request operation
 * modes.
 */
export const opModeMiddleware: Middleware<{}, RootState> = (store) => (next) => (action) => {
  const result = next(action)

  switch (action.type) {
    case requestOpMode.type:
    case roverConnected.type: {
      store.dispatch(
        messageRover({
          message: {
            type: 'operationModeRequest',
            mode: store.getState().opMode.mode,
          },
        })
      )
      break
    }

    default:
      break
  }

  return result
}
