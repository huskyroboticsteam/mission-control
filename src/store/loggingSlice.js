import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  logLevel: "trace",
  logEntries: []
}

const loggingSlice = createSlice({
  name: "logging",
  initialState,
  reducers: {
    setLogLevel(state, action) {
      const { logLevel } = action.payload;
      state.logLevel = logLevel;
    },

    logEntryReportReceived(state, action) {
      const { logEntry } = action.payload;
      state.logEntries.push(logEntry);
    }
  }
});

export const { setLogLevel, logEntryReportReceived } = loggingSlice.actions;

export const selectLogLevel = state => state.logging.logLevel;
export const selectLogEntries = state => {
  const logLevels = ["trace", "debug", "info", "warn", "error"];
  const logLevelIndex = logLevels.indexOf(state.logging.logLevel);
  return state.logging.logEntries.filter(logEntry =>
    logLevels.indexOf(logEntry.logLevel) >= logLevelIndex);
};

export default loggingSlice.reducer;
