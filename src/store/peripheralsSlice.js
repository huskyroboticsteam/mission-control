import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  mountedPeripheral: null
};

const peripheralsSlice = createSlice({
  name: "peripherals",
  initialState,
  reducers: {
    mountedPeripheralReportReceived(state, action) {
      state.mountedPeripheral = action.payload.peripheral;
    }
  }
});

export const { mountedPeripheralReportReceived } = peripheralsSlice.actions;

export const selectMountedPeripheral = state => state.peripherals.mountedPeripheral;

export default peripheralsSlice.reducer;
