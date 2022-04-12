import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  connectToRover,
  selectRoverIsConnected,
  selectRoverIsConnecting
} from "../../store/roverSocketSlice";

/**
 * RoverSocketManager manages the WebSocket connection to the rover.
 */
function RoverSocketManager() {
  const dispatch = useDispatch();
  const roverIsConnected = useSelector(selectRoverIsConnected);
  const roverIsConnecting = useSelector(selectRoverIsConnecting);

  // Connect to rover.
  useEffect(() => {
    if (!roverIsConnected && !roverIsConnecting)
      dispatch(connectToRover());
  }, [dispatch, roverIsConnected, roverIsConnecting]);

  return null;
}

export default RoverSocketManager;
