import {Euler, Quaternion} from '@math.gl/core'
import {createSlice} from '@reduxjs/toolkit'

const initialState = {
  orientW: null,
  orientX: null,
  orientY: null,
  orientZ: null,
  lon: null,
  lat: null,
  alt: null,
  recency: null,
}

const telemetrySlice = createSlice({
  name: 'telemetry',
  initialState,
  reducers: {
    roverPositionReportReceived(state, action) {
      const {orientW, orientX, orientY, orientZ, lon, lat, alt, recency} = action.payload
      state.orientW = orientW
      state.orientX = orientX
      state.orientY = orientY
      state.orientZ = orientZ
      state.lon = lon
      state.lat = lat
      state.alt = alt
      state.recency = recency
    },
  },
})

export const {roverPositionReportReceived} = telemetrySlice.actions
export const selectRoverPosition = (state) => state.telemetry
export const selectRoverLatitude = (state) =>
  state.telemetry.lat == null ? 0 : state.telemetry.lat
export const selectRoverLongitude = (state) =>
  state.telemetry.lon == null ? 0 : state.telemetry.lon
function selectRoverQuaternion(state) {
  return new Quaternion(
    state.telemetry.orientX,
    state.telemetry.orientY,
    state.telemetry.orientZ,
    state.telemetry.orientW
  )
}

function selectRoverEulerAngles(state) {
  return new Euler().fromQuaternion(selectRoverQuaternion(state))
}

export function selectRoverYaw(state) {
  return selectRoverEulerAngles(state).yaw
}
export function selectRoverHeading(state) {
  return 360 - (selectRoverYaw(state) * 180) / Math.PI
}

export default telemetrySlice.reducer
