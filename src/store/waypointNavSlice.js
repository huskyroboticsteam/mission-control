import {createSlice} from '@reduxjs/toolkit'

const initialState = {
  latitude: null,
  longitude: null,
  isApproximate: false,
  isGate: false,
}

const waypointNavSlice = createSlice({
  name: 'waypointNav',
  initialState,
  reducers: {
    requestWaypointNav(state, action) {
      const { isApproximate, isGate } = action.payload;
      state.isApproximate = !!isApproximate;
      state.isGate = !!isGate;
    },
    setWaypointPosition(state, action) {
      const { latitude, longitude } = action.payload;
      state.latitude = typeof latitude == "string" ? Number.parseFloat(latitude) : latitude;
      state.longitude = typeof longitude == "string" ? Number.parseFloat(longitude) : longitude;
    }
  }
});

export const { requestWaypointNav, setWaypointPosition } = waypointNavSlice.actions;

export const selectLatitude = state => state.waypointNav.latitude;
export const selectLongitude = state => state.waypointNav.longitude;
export const selectIsApproximate = state => state.waypointNav.isApproximate;
export const selectIsGate = state => state.waypointNav.isGate;

export default waypointNavSlice.reducer
