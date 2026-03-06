import type {Middleware} from '@reduxjs/toolkit'
import {messageRover} from '../roverSocketSlice.js'
import {requestWaypointNav} from '../waypointNavSlice.js'
import type {RootState} from '../store.js'

export const waypointNavMiddleware: Middleware<{}, RootState> = (store) => (next) => (action) => {
  const result = next(action)

  switch (action.type) {
    case requestWaypointNav.type:
      store.dispatch(
        messageRover({
          message: {
            type: 'waypointNavRequest',
            ...store.getState().waypointNav,
          },
        })
      )
      break

    default:
      break
  }

  return result
}
