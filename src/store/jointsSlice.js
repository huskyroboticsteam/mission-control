import {createSlice} from '@reduxjs/toolkit'

const jointNames = [
  'armBase',
  'shoulder',
  'elbow',
  'forearm',
  'wristPitch',
  'wristRoll',
  'hand',
  'handActuator',
  'drillActuator',
  'drillMotor',
  'ikUp',
  'ikForward',
  'fourBarLinkage',
]

const initialState = jointNames.reduce(
  (state, jointName) => ({
    ...state,
    [jointName]: {
      requestedPower: null,
      requestedPosition: null,
      currentPosition: null,
    },
  }),
  {}
)

const jointsSlice = createSlice({
  name: 'joints',
  initialState,
  reducers: {
    requestJointPower(state, action) {
      const {jointName, power} = action.payload
      const joint = state[jointName]
      joint.requestedPower = power
    },

    requestJointPosition(state, action) {
      const {jointName, position} = action.payload
      const joint = state[jointName]
      joint.requestedPosition = position
    },

    jointPositionReportReceived(state, action) {
      const {jointName, position} = action.payload
      const joint = state[jointName]
      joint.currentPosition = position
      return state
    },
  },
})

export const {requestJointPower, requestJointPosition, jointPositionReportReceived} =
  jointsSlice.actions

export const selectAllJointNames = (state) => Object.keys(state.joints)
export const selectJointCurrentPosition = (jointName) => (state) =>
  state.joints[jointName].currentPosition

export default jointsSlice.reducer
