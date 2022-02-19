import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  connectToRover,
  selectRoverIsConnected,
  selectRoverIsConnecting
} from "../../store/roverSocketSlice";
import GamepadController from "../input/GamepadController";
import KeyboardController from "../input/KeyboardController";
import Sidebar from "../sidebar/Sidebar";
import PanelContainer from "../panelContainer/PanelContainer";
import "./App.css";

function App() {
  const dispatch = useDispatch();
  const roverIsConnected = useSelector(selectRoverIsConnected);
  const roverIsConnecting = useSelector(selectRoverIsConnecting);

  // Connect to rover.
  useEffect(() => {
    if (!roverIsConnected && !roverIsConnecting)
      dispatch(connectToRover());
  }, [dispatch, roverIsConnected, roverIsConnecting]);

  // Disable context menu.
  useEffect(() => {
    const handleContextMenu = event => event.preventDefault();
    document.addEventListener("contextmenu", handleContextMenu);
    return () => document.removeEventListener("contextmenu", handleContextMenu);
  }, []);

  return (
    <div className="app">
      <GamepadController gamepadName="driveGamepad" gamepadIndex={0} />
      <GamepadController gamepadName="peripheralGamepad" gamepadIndex={1} />
      <KeyboardController />
      <Sidebar />
      <PanelContainer />
    </div>
  );
}

export default App;
