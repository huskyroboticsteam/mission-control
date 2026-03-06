import {isAnyOf, type Middleware} from '@reduxjs/toolkit'
import {driveSlice, requestDrive, requestTankDrive} from '../driveSlice.js'
import {selectMotorsAreEnabled} from '../motorSlice.js'
import {messageRover} from '../roverSocketSlice.js'
import type {RootState, RoverStoreAPI} from '../store.js'

/**
 * Middleware that handles sending drive requests to the rover.
 */
export const driveMiddleware: Middleware<{}, RootState> =
  (store: RoverStoreAPI) => (next) => (action) => {
    const result = next(action)

    if (isAnyOf(...Object.values(driveSlice.actions))(action)) {
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
      }
    }

    return result
  }
