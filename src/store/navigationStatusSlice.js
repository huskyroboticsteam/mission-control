import { createSlice } from "@reduxjs/toolkit";

const navigationStatusSlice = createSlice({
    name: "navigationStatus",
    initialState,
    reducers: {
        navigationStatusReceived: (state, action) => {
            const { status, distanceToTarget, errorMessage } = action.payload;
            state.status = status;
            state.distanceToTarget = distanceToTarget;
            state.errorMessage = errorMessage;
        },
        resetNavigationStatus: (state) => {
            state.status = null;
            state.distanceToTarget = null;
            state.errorMessage = null;
        }
    }
});

export const { navigationStatusReceived, resetNavigationStatus } = navigationStatusSlice.actions;
export const selectNavigationStatus = state => state.navigationStatus;
export const selectDistanceToTarget = state => state.navigationStatus.distanceToTarget;
export const selectNavigationError = state => state.navigationStatus.errorMessage;
export default navigationStatusSlice.reducer;