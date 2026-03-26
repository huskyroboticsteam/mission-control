import {useEffect} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {
  connectToRover,
  selectRoverIsConnected,
} from '../../store/roverSocketSlice.js'
import {CONNECTION_ATTEMPT_DELAY} from '../../constants/networkConstants.js'
import type {RoverDispatch} from '../../store/store.js'

/**
 * RoverSocketManager manages the WebSocket connection to the rover.
 */
export const RoverSocketManager = () => {
  const dispatch = useDispatch<RoverDispatch>()
  const roverIsConnected = useSelector(selectRoverIsConnected)

  // Connect to rover.
  useEffect(() => {
    dispatch(connectToRover())

    const id = setInterval(() => {
      if (!roverIsConnected) {
        dispatch(connectToRover())
      }
    }, CONNECTION_ATTEMPT_DELAY)

    return () => clearInterval(id)
  }, [])

  return null
}
