import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    orientW: null,
    orientX: null,
    orientY: null,
    orientZ: null,
    posX: null,
    posY: null,
    posZ: null,
    recency: null
}

const telemetrySlice = createSlice({
    name: "telemetry",
    initialState,
    reducers: {
        roverPositionReportReceived(state, action) {
            const { orientW, orientX, orientY, orientZ, posX, posY, posZ, recency } = action.payload;
            state.orientW = orientW;
            state.orientX = orientX;
            state.orientY = orientY;
            state.orientZ = orientZ;
            state.posX = posX;
            state.posY = posY;
            state.posZ = posZ;
            state.recency = recency;
        }
    }
});

export const { roverPositionReportReceived } = telemetrySlice.actions;
export const selectRoverPosition = state => state.telemetry;

export default telemetrySlice.reducer;