import {roverConnected, messageRover} from '../roverSocketSlice.js'
import {requestOpMode} from '../opModeSlice.js'
import {isAnyOf, type Middleware} from '@reduxjs/toolkit'
import type {RootState, RoverStoreAPI} from '../store.js'

/**
 * Middleware that handles sending messages to the rover to request operation
 * modes.
 */
export const opModeMiddleware: Middleware<{}, RootState> =
  (store: RoverStoreAPI) => (next) => (action) => {
    const result = next(action)

    if (isAnyOf(requestOpMode, roverConnected)(action)) {
      store.dispatch(
        messageRover({
          message: {
            type: 'operationModeRequest',
            mode: store.getState().opMode.mode,
          },
        })
      )
    }

    return result
  }
