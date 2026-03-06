import {roverPositionReportReceived} from '../telemetrySlice.js'
import {messageReceivedFromRover} from '../roverSocketSlice.js'
import type {Middleware} from '@reduxjs/toolkit'
import type {RootState, RoverStoreAPI} from '../store.js'

export const telemetryMiddleware: Middleware<{}, RootState> =
  (store: RoverStoreAPI) => (next) => (action) => {
    const result = next(action)

    if (messageReceivedFromRover.match(action)) {
      const {message} = action.payload
      if (message.type === 'roverPositionReport') {
        store.dispatch(roverPositionReportReceived(message))
      }
    }

    return result
  }
