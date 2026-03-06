import type {Middleware} from '@reduxjs/toolkit'
import {
  requestJointPower,
  requestJointPosition,
  jointPositionReportReceived,
} from '../jointSlice.js'
import {selectMotorsAreEnabled} from '../motorSlice.js'
import {messageRover, messageReceivedFromRover} from '../roverSocketSlice.js'
import type {RootState} from '../store.js'

/**
 * Middleware that handles sending and receiving joint data.
 */
export const jointMiddleware: Middleware<{}, RootState> = (store) => (next) => (action) => {
  const result = next(action)

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

    default:
      break
  }

  return result
}
