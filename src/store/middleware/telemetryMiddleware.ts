import {roverPositionReportReceived} from '../telemetrySlice.js'
import {messageReceivedFromRover} from '../roverSocketSlice.js'
import type {Middleware} from '@reduxjs/toolkit'
import type {RootState} from '../store.js'

export const telemetryMiddleware: Middleware<{}, RootState> = (store) => (next) => (action) => {
  const result = next(action)

  if (action.type === messageReceivedFromRover.type) {
    const {message} = action.payload
    if (message.type === 'roverPositionReport') {
      store.dispatch(roverPositionReportReceived(message))
    }
  }

  return result
}
