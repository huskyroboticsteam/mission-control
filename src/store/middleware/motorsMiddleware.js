import {enableMotors} from '../motorsSlice'
import {requestDrive} from '../driveSlice'
import {requestJointPower, selectAllJointNames} from '../jointsSlice'
import {enableIK} from '../inputSlice'

/**
 * Middleware that handles receiving motor telemetry.
 */
const motorsMiddleware = (store) => (next) => (action) => {
  switch (action.type) {
    case enableMotors.type: {
      const {enabled} = action.payload
      // send ik packet with false
      store.dispatch(enableIK({enable: false}))
      if (!enabled) {
        store.dispatch(
          requestDrive({
            straight: 0,
            steer: 0,
          })
        )

        const jointNames = selectAllJointNames(store.getState())
        jointNames.forEach((jointName) => {
          store.dispatch(
            requestJointPower({
              jointName,
              power: 0,
            })
          )
        })
      }
      return next(action)
    }

    default:
      break
  }

  return next(action)
}

export default motorsMiddleware
