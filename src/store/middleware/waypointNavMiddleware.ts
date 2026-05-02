import type {Middleware} from '@reduxjs/toolkit'
import {messageRover} from '../roverSocketSlice.js'
import {requestWaypointNav} from '../waypointNavSlice.js'
import type {RootState, RoverStoreAPI} from '../store.js'

export const waypointNavMiddleware: Middleware<{}, RootState> =
  (store: RoverStoreAPI) => (next) => (action) => {
    const result = next(action)

    if (requestWaypointNav.match(action)) {
      store.dispatch(
        messageRover({
          message: {
            type: 'waypointNavRequest',
            ...store.getState().waypointNav,
          },
        })
      )
    }

    return result
  }
