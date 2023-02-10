import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    orientW: null,
    orientX: null,
    orientY: null,
    orientZ: null,
    posX: null,
    posY: null,
    posZ: null,
    timestamp: null
}

const teleSlice = createSlice({
    name: "telemetry",
    initialState,
    reducers: {
        roverPositionReportReceived(state, action){
            const { orientW, orientX, orientY, orientZ, posX, posY, posZ, timestamp } = action.payload;
            state.orientW = orientW;
            state.orientX = orientX;
            state.orientY = orientY;
            state.orientZ = orientZ;
            state.posX = posX;
            state.posY = posY;
            state.posZ = posZ;
            state.timestamp = timestamp;
        }
    }
});

export const { updatePosition } = teleSlice.actions;
export const selectRoverCurrentPosition = state => { state.orientW, state.orientX, state.orientY, state.orientZ, state.posX, state.posY, state.posZ, state.timestamp };