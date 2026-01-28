import {requestServoPosition, servoPositionReportReceived} from '../servoSlice.js'
import {messageRover, messageReceivedFromRover} from '../roverSocketSlice.js'

const servoMiddleware = (store) => (next) => (action) => {
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

export default servoMiddleware
