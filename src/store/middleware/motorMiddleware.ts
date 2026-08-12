import {enableMotors} from '../motorSlice.js'
import type {Middleware} from '@reduxjs/toolkit'
import type {RootState, RoverStoreAPI} from '../store.js'
import {messageRover} from '../roverSocketSlice.js'

/**
 * Middleware that handles receiving motor telemetry.
 */
export const motorMiddleware: Middleware<{}, RootState> =
  (store: RoverStoreAPI) => (next) => (action) => {
    const prev = store.getState()
    const result = next(action)

    if (enableMotors.match(action)) {
      const {enabled} = action.payload
      if (enabled !== prev.motor.motorsEnabled) {
        store.dispatch(
          messageRover({
            message: {
              type: 'enableMotorsRequest',
              enabled: enabled,
            },
          })
        )
      }
    }

    return result
  }
