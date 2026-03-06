import type {Middleware} from '@reduxjs/toolkit'
import {requestDrive, requestTankDrive} from '../driveSlice.js'
import {selectMotorsAreEnabled} from '../motorSlice.js'
import {messageRover} from '../roverSocketSlice.js'
import type {RootState} from '../store.js'

/**
 * Middleware that handles sending drive requests to the rover.
 */
export const driveMiddleware: Middleware<{}, RootState> = (store) => (next) => (action) => {
  const result = next(action)

  switch (action.type) {
    case requestDrive.type: {
      if (selectMotorsAreEnabled(store.getState())) {
        const {straight, steer} = action.payload
        store.dispatch(
          messageRover({
            message: {
              type: 'driveRequest',
              straight,
              steer,
            },
          })
        )
      }
      break
    }

    case requestTankDrive.type: {
      if (selectMotorsAreEnabled(store.getState())) {
        const {left, right} = action.payload
        store.dispatch(
          messageRover({
            message: {
              type: 'tankDriveRequest',
              left,
              right,
            },
          })
        )
      }
      break
    }

    default:
      break
  }

  return result
}
