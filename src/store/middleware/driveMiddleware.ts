import {isAnyOf, type Middleware} from '@reduxjs/toolkit'
import {driveSlice, requestDrive, requestDriveMode, requestTankDrive} from '../driveSlice.js'
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
      if (selectMotorsAreEnabled(store.getState())) {
        switch (action.type) {
          case requestDriveMode.type: {
            break
          }

          case requestDrive.type: {
            const {straight, steer} = action.payload
            if (store.getState().drive.driveMode === 'normal') {
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
            const {left, right} = action.payload
            if (store.getState().drive.driveMode === 'tank') {
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
    }

    return result
  }
