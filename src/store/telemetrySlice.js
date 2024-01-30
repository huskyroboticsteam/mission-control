import { createSlice } from "@reduxjs/toolkit"
import { Cartesian3 } from "cesium";
const initialState = {
    orientW: null,
    orientX: null,
    orientY: null,
    orientZ: null,
    lon: null,
    lat: null,
    recency: null
}

const telemetrySlice = createSlice({
    name: "telemetry",
    initialState,
    reducers: {
        roverPositionReportReceived(state, action) {
            const { orientW, orientX, orientY, orientZ, lon, lat, recency } = action.payload;
            state.orientW = orientW;
            state.orientX = orientX;
            state.orientY = orientY;
            state.orientZ = orientZ;
            state.lon = lon;
            state.lat = lat;
            state.recency = recency;
        }
    }
});

export const { roverPositionReportReceived } = telemetrySlice.actions;
export const selectRoverPosition = state => state.telemetry;
export const selectRoverLatitude = state => state.telemetry.lat == null ? 0 : state.telemetry.lat;
export const selectRoverLongitude = state => state.telemetry.lon == null ? 0 : state.telemetry.lon;

export default telemetrySlice.reducer;
