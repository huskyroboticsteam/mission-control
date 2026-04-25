import {isAnyOf, type Middleware} from '@reduxjs/toolkit'
import type {RootState, RoverStoreAPI} from '../store.js'
import {mapSlice} from '../mapSlice.js'
import {setItem} from '../../util/localStorage.js'

export const mapMiddleware: Middleware<{}, RootState> =
  (store: RoverStoreAPI) => (next) => (action) => {
    const result = next(action)
    const state = store.getState()

    if (isAnyOf(...Object.values(mapSlice.actions))(action)) {
      setItem('pins', JSON.stringify(state.map.pins))
      setItem('nextPinID', state.map.nextPinID.toString())
    }

    return result
  }
