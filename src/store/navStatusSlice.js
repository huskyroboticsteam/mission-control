import {createSlice} from '@reduxjs/toolkit'

const initialState = {
  currTarget: null,
  relativeDistance: null,
  roverStatus: null,
}

const navStatusSlice = createSlice({
  name: 'navStatus',
  initialState,
  reducers: {
    roverStatusReportReceived(state, action) {
      const {currTarget, relativeDistance, roverStatus} = action.payload
      state.currTarget = currTarget
      state.relativeDistance = relativeDistance
      state.roverStatus = roverStatus
    },
  },
})

export const {roverStatusReportReceived} = navStatusSlice.actions
export const selectRoverStatus = (state) => state.navStatus

export default navStatusSlice.reducer
