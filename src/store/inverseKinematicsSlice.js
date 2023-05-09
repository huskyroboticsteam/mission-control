import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    enabled: false
}

const inverseKinematicsSlice = createSlice({
  name: "inverseKinematics",
  initialState,
  reducers: {
    enableIK(state, action) {
      const { enable } = action.payload;
      state.enabled = enable;
    }
  }
});

export const { enableIK } = inverseKinematicsSlice.actions;

export const selectInverseKinematicsEnabled = state => state.inverseKinematics.enabled;

export default inverseKinematicsSlice.reducer;
