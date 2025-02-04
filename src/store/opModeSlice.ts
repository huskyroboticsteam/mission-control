import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  mode: "teleoperation"
};

const opModeSlice = createSlice({
  name: "opMode",
  initialState,
  reducers: {
    requestOpMode(state, action) {
      state.mode = action.payload.mode;
    }
  }
});

export const { requestOpMode } = opModeSlice.actions;

export const selectOpMode = state => state.opMode.mode;

export default opModeSlice.reducer;
