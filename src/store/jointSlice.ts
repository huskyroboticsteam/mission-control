import {createSlice, type PayloadAction} from '@reduxjs/toolkit'
import {JointNames} from '../constants/jointConstants.js'
import type {RootState} from './store.js'

type JointState = {
  readonly [J in keyof typeof JointNames]: {
    readonly requestedPower: number | null
    readonly requestedPosition: number | null
    readonly currentPosition: number | null
  }
}

const initialState: JointState = Object.keys(JointNames).reduce<JointState>(
  (state, jointName) => ({
    ...state,
    [jointName]: {
      requestedPower: null,
      requestedPosition: null,
      currentPosition: null,
    },
  }),
  {} as JointState
)

export const jointSlice = createSlice({
  name: 'joint',
  initialState,
  reducers: {
    requestJointPower: (
      state,
      action: PayloadAction<{jointName: keyof typeof JointNames; power: number}>
    ) => {
      const {jointName, power} = action.payload
      state[jointName].requestedPower = power
    },

    requestJointPosition: (
      state,
      action: PayloadAction<{jointName: keyof typeof JointNames; position: number}>
    ) => {
      const {jointName, position} = action.payload
      state[jointName].requestedPosition = position
    },

    jointPositionReportReceived: (
      state,
      action: PayloadAction<{jointName: keyof typeof JointNames; position: number}>
    ) => {
      const {jointName, position} = action.payload
      state[jointName].currentPosition = position
    },
  },
})

export const {requestJointPower, requestJointPosition, jointPositionReportReceived} =
  jointSlice.actions

export const selectJointCurrentPosition =
  (jointName: keyof typeof JointNames) => (state: RootState) =>
    state.joint[jointName].currentPosition
