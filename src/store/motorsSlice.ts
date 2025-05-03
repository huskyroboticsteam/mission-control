import { PayloadAction, createSlice } from '@reduxjs/toolkit'

// type MotorPower = {
//   currentPower: number
//   currentPosition: number
// }

type MotorState = {
  currentPower: number | null;
  currentPosition: number | null;
}

// type MotorsState = {
//   motorsEnabled: boolean;
//   // Using a Record to define a dictionary where keys are motor names (strings)
//   // and values are MotorState objects.
   
//   [motorName: string]: MotorState | boolean; // Allow boolean for motorsEnabled
// }

const motorNames = [
  'frontLeftWheel',
  'frontRightWheel',
  'rearLeftWheel',
  'rearRightWheel',
  'armBase',
  'shoulder',
  'elbow',
  'forearm',
  'wristPitch',
  'wristRoll',
  'hand',
] as const;

/** Type representing valid motor names */
export type MotorName = typeof motorNames[number];

type MotorsState = {
  motorsEnabled: boolean;
  // Use Record<KeyType, ValueType> for a clearly defined dictionary.
  // Here, keys are the specific motor names (MotorName), and values are MotorState.
  motorDetails: Record<MotorName, MotorState>;
}

/**
 * Defines the structure of the payload for the motorStatusReportReceived action.
 * Ensures motorName is one of the defined MotorName types.
 */
interface MotorStatusReportPayload {
  motorName: MotorName; // Use the specific MotorName type
  power: number;
  position: number;
}

/**
 * Defines the structure of the payload for the enableMotors action.
 */
interface EnableMotorsPayload {
  enabled: boolean;
}

/**
 * Represents the root state of the Redux store.
 * Adjust this based on your actual root state structure.
 */
interface RootState {
  motors: MotorsState;
  // Add other state slices here if needed
  // e.g., otherSlice: OtherState;
}


// --- Initial State ---

// Define the initial state for a single motor
const initialMotorState: MotorState = {
  currentPower: null,
  currentPosition: null,
};

// Generate the initial state object with the new structure.
// Start with motorsEnabled and an empty details object, then populate details.
const initialState: MotorsState = {
  motorsEnabled: false,
  // Initialize details as a Record populated by reducing over motorNames
  motorDetails: motorNames.reduce((acc, motorName) => {
    // acc is the accumulator (the Record being built)
    // motorName is the current motor name from the array
    acc[motorName] = { ...initialMotorState }; // Assign initial state for this motor
    return acc; // Return the updated accumulator
  }, {} as Record<MotorName, MotorState>), // Start with an empty Record, properly typed
};


// --- Slice Definition ---

const motorSlice = createSlice({
  name: 'motors',
  initialState, // Use the typed initial state with the new structure
  reducers: {
    /**
     * Reducer to handle incoming motor status reports.
     * Updates the power and position for a specific motor in the 'details' Record.
     */
    motorStatusReportReceived(state, action: PayloadAction<MotorStatusReportPayload>) {
      const { motorName, power, position } = action.payload;
      // Access the specific motor's state within the 'details' Record.
      // Type safety is improved as motorName is guaranteed to be a valid MotorName key.
      const motor = state.motorDetails[motorName];
      if (motor) { // Check if motor exists (should always be true based on types)
        motor.currentPower = power;
        motor.currentPosition = position;
      }
      // Note: Redux Toolkit uses Immer, allowing direct "mutation".
    },
    /**
     * Reducer to enable or disable all motors.
     */
    enableMotors(state, action: PayloadAction<EnableMotorsPayload>) {
      const { enabled } = action.payload;
      state.motorsEnabled = enabled;
    },
  },
});


export const { motorStatusReportReceived, enableMotors } = motorSlice.actions

// export const selectAllMotorNames = (state) => Object.keys(state.motors)
export const selectAllMotorNames = (state: RootState): MotorName[] => {
  return Object.keys(state.motors.motorDetails) as MotorName[];
}

// export const selectMotorsAreEnabled = (state) => state.motors.motorsEnabled
export const selectMotorsAreEnabled = (state: RootState): boolean => {
  return state.motors.motorsEnabled;
}

// export const selectMotorCurrentPower = (motorName) => (state) =>
//   state.motors[motorName].currentPower
// export const selectMotorCurrentPosition = (motorName) => (state) =>
//   state.motors[motorName].currentPosition

/**
 * Creates a selector to get the current power of a specific motor.
 * @param motorName The name of the motor (must be a valid MotorName).
 * @returns A selector function that returns the motor's current power (number | null).
 */
export const selectMotorCurrentPower = (motorName: MotorName) => (state: RootState): number | null => {
  // Access power from the 'motorDetails' object using the specific MotorName key.
  // Added a check for safety, though type system should largely prevent invalid keys.
  const motor = state.motors.motorDetails[motorName];
  return motor ? motor.currentPower : null;
}


/**
* Creates a selector to get the current position of a specific motor.
* @param motorName The name of the motor (must be a valid MotorName).
* @returns A selector function that returns the motor's current position (number | null).
*/
export const selectMotorCurrentPosition = (motorName: MotorName) => (state: RootState): number | null => {
  // Access position from the 'motorDetails' object using the specific MotorName key.
  const motor = state.motors.motorDetails[motorName];
  return motor ? motor.currentPosition : null;
}


export default motorSlice.reducer
