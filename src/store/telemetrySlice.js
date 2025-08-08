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

export default telemetrySlice.reducer
