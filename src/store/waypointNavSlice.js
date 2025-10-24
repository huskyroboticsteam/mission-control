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
      const nextPoints = Array.isArray(points)
        ? points
        : JSON.parse(points ?? '[]')
      state.points = nextPoints.map((point) => (Array.isArray(point) ? [...point] : point))
      state.isApproximate = !!isApproximate
      state.isGate = !!isGate
    },
    setPoints(state, action) {
      const payload = Array.isArray(action.payload) ? action.payload : []
      state.points = payload.map((point) => (Array.isArray(point) ? [...point] : point))
    },
    setWaypointPosition(state, action) {
      const {latitude, longitude} = action.payload
      state.latitude = typeof latitude == 'string' ? Number.parseFloat(latitude) : latitude
      state.longitude = typeof longitude == 'string' ? Number.parseFloat(longitude) : longitude
    },
  },
})

export const {requestWaypointNav, setWaypointPosition, setPoints} = waypointNavSlice.actions

export const selectLatitude = (state) => state.waypointNav.latitude
export const selectLongitude = (state) => state.waypointNav.longitude
export const selectPoints = (state) => state.waypointNav.points
export const selectIsApproximate = (state) => state.waypointNav.isApproximate
export const selectIsGate = (state) => state.waypointNav.isGate

export default waypointNavSlice.reducer
