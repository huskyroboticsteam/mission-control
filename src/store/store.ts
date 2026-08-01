import {combineReducers, configureStore, type MiddlewareAPI} from '@reduxjs/toolkit'
import {inputSlice} from './inputSlice.js'
import {inputMiddleware} from './middleware/inputMiddleware.js'

const rootReducer = combineReducers({
  input: inputSlice.reducer,
})

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(
      inputMiddleware,
    ),
})

export type RootState = ReturnType<typeof rootReducer>
export type RoverDispatch = typeof store.dispatch
export type RoverStoreAPI = MiddlewareAPI<RoverDispatch, RootState>
