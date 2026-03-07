import {createSlice, type PayloadAction} from '@reduxjs/toolkit'
import type {RootState} from './store.js'

type WaypointNavState = {
  readonly latitude: number | null
  readonly longitude: number | null
  readonly isApproximate: boolean
  readonly isGate: boolean
}

const initialState: WaypointNavState = {
  latitude: null,
  longitude: null,
  isApproximate: false,
  isGate: false,
}

export const waypointNavSlice = createSlice({
  name: 'waypointNav',
  initialState,
  reducers: {
    requestWaypointNav: (
      state,
      action: PayloadAction<{isApproximate: boolean; isGate: boolean}>
    ) => {
      const {isApproximate, isGate} = action.payload
      state.isApproximate = isApproximate
      state.isGate = isGate
    },

    setWaypointPosition: (
      state,
      action: PayloadAction<{latitude: number | null; longitude: number | null}>
    ) => {
      const {latitude, longitude} = action.payload
      state.latitude = latitude
      state.longitude = longitude
    },
  },
})

export const {requestWaypointNav, setWaypointPosition} = waypointNavSlice.actions

export const selectLatitude = (state: RootState) => state.waypointNav.latitude
export const selectLongitude = (state: RootState) => state.waypointNav.longitude
export const selectIsApproximate = (state: RootState) => state.waypointNav.isApproximate
export const selectIsGate = (state: RootState) => state.waypointNav.isGate
