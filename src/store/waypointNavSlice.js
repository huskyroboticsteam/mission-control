import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  latitude: 0,
  longitude: 0,
  approximate: false,
  gated: false,
};

const waypointNavSlice = createSlice({
  name: "waypointNav",
  initialState,
  reducers: {
    requestWaypointNav(state, action) {
      const { latitude, longitude, approximate, gated } = action.payload;
      state.latitude = typeof latitude == "string" ? Number.parseFloat(latitude) : latitude;
      state.longitude = typeof longitude == "string" ? Number.parseFloat(longitude) : longitude;
      state.approximate = !!approximate;
      state.gated = !!gated;
    }
  }
});

export const { requestWaypointNav } = waypointNavSlice.actions;

export const selectLatitude = state => state.latitude;
export const selectLongitude = state => state.longitude;
export const selectIsApproximate = state => state.approximate;
export const selectIsGated = state => state.gated;

export default waypointNavSlice.reducer;
