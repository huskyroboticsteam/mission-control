import {createSlice} from '@reduxjs/toolkit'

const initialState = {
  latitude: 0,
  longitude: 0,
  points: [],
  isApproximate: false,
  isGate: false,
}

const waypointNavSlice = createSlice({
  name: 'waypointNav',
  initialState,
  reducers: {
    requestWaypointNav(state, action) {
      const {latitude, longitude, points, isApproximate, isGate} = action.payload
      state.latitude = typeof latitude == 'string' ? Number.parseFloat(latitude) : latitude
      state.longitude = typeof longitude == 'string' ? Number.parseFloat(longitude) : longitude
      state.points = points
      console.log("this is the state: ")
      console.log(points)
      state.isApproximate = !!isApproximate
      state.isGate = !!isGate
    },
  },
})

export const {requestWaypointNav} = waypointNavSlice.actions

export const selectLatitude = (state) => state.waypointNav.latitude
export const selectLongitude = (state) => state.waypointNav.longitude
export const selectPoints = (state) => state.waypointNav.points
export const selectIsApproximate = (state) => state.waypointNav.isApproximate
export const selectIsGate = (state) => state.waypointNav.isGate

export default waypointNavSlice.reducer
