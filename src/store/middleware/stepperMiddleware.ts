import {messageRover} from '../roverSocketSlice.js'
import {requestStepperTurnAngle} from '../stepperSlice.js'

const stepperMiddleware = (store) => (next) => (action) => {
  const result = next(action)

  switch (action.type) {
    case requestStepperTurnAngle.type: {
      const {stepperName, angle} = action.payload
      store.dispatch(
        messageRover({
          message: {
            type: 'stepperTurnAngleRequest',
            stepper: stepperName,
            angle,
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

export default stepperMiddleware
