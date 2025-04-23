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
  'drillArm',
  'drillMotor',
  'activeSuspension',
  'ikUp',
  'ikForward',
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
  {
    drillEnabled: false,
  }
)

const jointsSlice = createSlice({
  name: 'joints',
  initialState,
  reducers: {
    requestJointPower(state, action) {
      const {jointName, power} = action.payload
      const joint = state[jointName]
      if (joint) {
        joint.requestedPower = power
        console.log(power)
      }
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

    enableDrillOn(state, action) {
      const {enabled} = action.payload
      state.drillEnabled = enabled
    },
  },
})

export const {requestJointPower, requestJointPosition, jointPositionReportReceived, enableDrillOn} =
  jointsSlice.actions

export const selectAllJointNames = (state) => Object.keys(state.joints)
export const selectJointCurrentPosition = (jointName) => (state) =>
  state.joints[jointName].currentPosition
export const selectDrillIsEnabled = (state) => state.joints.drillEnabled

export default jointsSlice.reducer
