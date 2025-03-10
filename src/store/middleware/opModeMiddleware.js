import {roverConnected, messageRover} from '../roverSocketSlice'
import {requestOpMode} from '../opModeSlice'

/**
 * Middleware that handles sending messages to the rover to request operation
 * modes.
 */
const opModeMiddleware = (store) => (next) => (action) => {
  const result = next(action)

  switch (action.type) {
    case requestOpMode.type:
    case roverConnected.type: {
      store.dispatch(
        messageRover({
          message: {
            type: 'operationModeRequest',
            mode: store.getState().opMode.mode,
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

export default opModeMiddleware
