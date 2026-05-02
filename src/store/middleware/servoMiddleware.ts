import {requestServoPosition, servoPositionReportReceived, servoSlice} from '../servoSlice.js'
import {messageRover, messageReceivedFromRover} from '../roverSocketSlice.js'
import {isAnyOf, type Middleware} from '@reduxjs/toolkit'
import type {RootState, RoverStoreAPI} from '../store.js'

export const servoMiddleware: Middleware<{}, RootState> =
  (store: RoverStoreAPI) => (next) => (action) => {
    const result = next(action)

    if (isAnyOf(requestServoPosition, messageReceivedFromRover)(action)) {
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
    }
    return result
  }
