import {createSlice, type PayloadAction} from '@reduxjs/toolkit'
import type {RootState} from './store.js'
import type {Peripheral} from '../constants/types.js'

type PeripheralState = {
  readonly mountedPeripheral: Peripheral | null
}

const initialState: PeripheralState = {
  mountedPeripheral: null,
}

export const peripheralSlice = createSlice({
  name: 'peripheral',
  initialState,
  reducers: {
    mountedPeripheralReportReceived: (
      state,
      action: PayloadAction<{peripheral: Peripheral | null}>
    ) => {
      state.mountedPeripheral = action.payload.peripheral
    },
  },
})

export const {mountedPeripheralReportReceived} = peripheralSlice.actions

export const selectMountedPeripheral = (state: RootState) => state.peripheral.mountedPeripheral
