import {isAnyOf, type Middleware} from '@reduxjs/toolkit'
import {
  requestJointPower,
  requestJointPosition,
  jointPositionReportReceived,
  jointSlice,
} from '../jointSlice.js'
import {selectMotorsAreEnabled} from '../motorSlice.js'
import {messageRover, messageReceivedFromRover} from '../roverSocketSlice.js'
import type {RootState, RoverStoreAPI} from '../store.js'

/**
 * Middleware that handles sending and receiving joint data.
 */
export const jointMiddleware: Middleware<{}, RootState> =
  (store: RoverStoreAPI) => (next) => (action) => {
    const result = next(action)

    if (isAnyOf(messageReceivedFromRover, ...Object.values(jointSlice.actions))(action)) {
      switch (action.type) {
        case requestJointPower.type: {
          if (selectMotorsAreEnabled(store.getState())) {
            const {jointName, power} = action.payload
            store.dispatch(
              messageRover({
                message: {
                  type: 'jointPowerRequest',
                  joint: jointName,
                  power,
                },
              })
            )
          }
          break
        }

        case requestJointPosition.type: {
          if (selectMotorsAreEnabled(store.getState())) {
            const {jointName, position} = action.payload
            store.dispatch(
              messageRover({
                message: {
                  type: 'jointPositionRequest',
                  joint: jointName,
                  position,
                },
              })
            )
          }
          break
        }

        case messageReceivedFromRover.type: {
          const {message} = action.payload
          if (message.type === 'jointPositionReport') {
            const {joint: jointName, position} = message
            store.dispatch(
              jointPositionReportReceived({
                jointName,
                position,
              })
            )
          }
          break
        }
      }

      return result
    }
  }
