import {enableMotors} from '../motorSlice.js'
import {requestDrive} from '../driveSlice.js'
import {requestJointPower} from '../jointSlice.js'
import type {Middleware} from '@reduxjs/toolkit'
import type {RootState, RoverStoreAPI} from '../store.js'
import {JointNames} from '../../constants/jointConstants.js'
import {enumKeys} from '../../util/enumKeys.js'
import {messageRover} from '../roverSocketSlice.js'

/**
 * Middleware that handles receiving motor telemetry.
 */
export const motorMiddleware: Middleware<{}, RootState> =
  (store: RoverStoreAPI) => (next) => (action) => {
    const result = next(action)

    if (enableMotors.match(action)) {
      const {enabled} = action.payload
      if (!enabled) {
        store.dispatch(
          messageRover({
            message: {
              type: 'disableMotors',
              motors: false,
            },
          })
        )
        // store.dispatch(
        //   requestDrive({
        //     straight: 0,
        //     steer: 0,
        //   })
        // )

        // enumKeys(JointNames).forEach((jointName) => {
        //   store.dispatch(
        //     requestJointPower({
        //       jointName,
        //       power: 0,
        //     })
        //   )
        // })
      }
    }

    return result
  }
