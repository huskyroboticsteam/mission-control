import {roverConnected, messageRover} from '../roverSocketSlice.js'
import {requestStop} from '../emergencyStopSlice.js'
import type {Middleware} from '@reduxjs/toolkit'
import type {RootState} from '../store.js'

/**
 * Middleware that handles sending messages to the rover to request emergency
 * stops.
 */
export const emergencyStopMiddleware: Middleware<{}, RootState> = (store) => (next) => (action) => {
  const result = next(action)

  switch (action.type) {
    case requestStop.type:
    case roverConnected.type: {
      store.dispatch(
        messageRover({
          message: {
            type: 'emergencyStopRequest',
            stop: store.getState().emergencyStop.stopped,
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
