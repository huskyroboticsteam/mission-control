import {requestServoPosition, servoPositionReportReceived, servoSlice} from '../servoSlice.js'
import {messageRover, messageReceivedFromRover} from '../roverSocketSlice.js'
import type {Dispatch, Middleware} from '@reduxjs/toolkit'
import type {RootState} from '../store.js'

export const servoMiddleware: Middleware<{}, RootState> = (store) => (next) => (action) => {
  const result = next(action)

  switch (action.type) {
    case requestServoPosition.type: {
      const {servoName, position} = action.payload
      store.dispatch(
        messageRover({
          message: {
            type: 'servoPositionRequest',
            servo: servoName,
            position,
          },
        })
      )
      break
    }

    case messageReceivedFromRover.type: {
      const {message} = action.payload
      if (message.type === 'servoPositionReport') {
        const {servo: servoName, position} = message
        store.dispatch(
          servoPositionReportReceived({
            servoName,
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
