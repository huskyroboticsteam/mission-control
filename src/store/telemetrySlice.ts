import {createSlice, type PayloadAction} from '@reduxjs/toolkit'
import type {RootState} from './store.js'

type TelemetryState = {
  readonly orientW: number | null
  readonly orientX: number | null
  readonly orientY: number | null
  readonly orientZ: number | null
  readonly lon: number | null
  readonly lat: number | null
  readonly alt: number | null
  readonly recency: number | null
}

const initialState: TelemetryState = {
  orientW: null,
  orientX: null,
  orientY: null,
  orientZ: null,
  lon: null,
  lat: null,
  alt: null,
  recency: null,
}

export const telemetrySlice = createSlice({
  name: 'telemetry',
  initialState,
  reducers: {
    roverPositionReportReceived: (_, action: PayloadAction<TelemetryState>) => {
      return action.payload
    },
  },
})

export const {roverPositionReportReceived} = telemetrySlice.actions

export const selectRoverPosition = (state: RootState) => state.telemetry
