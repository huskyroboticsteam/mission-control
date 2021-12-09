import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { connectToRover, disconnectFromRover } from "../store/roverSlice";
import GamepadController from "./input/GamepadController";
import KeyboardController from "./input/KeyboardController";
import Sidebar from "./sidebar/Sidebar";
import PanelContainer from "./panelContainer/PanelContainer";
import "./App.css";

function App() {
  const dispatch = useDispatch();

  // Connect to rover.
  useEffect(() => {
    dispatch(connectToRover());
    return () => dispatch(disconnectFromRover());
  }, [dispatch]);

  // Disable context menu.
  useEffect(() => {
    const handleContextMenu = event => event.preventDefault();
    document.addEventListener("contextmenu", handleContextMenu);
    return () => document.removeEventListener("contextmenu", handleContextMenu);
  }, []);

  return (
    <div className="app">
      <GamepadController gamepadName="driveGamepad" gamepadIndex={0} />
      <GamepadController gamepadName="armGamepad" gamepadIndex={1} />
      <KeyboardController />
      <Sidebar />
      <PanelContainer />
    </div>
  );
}

export default App;
