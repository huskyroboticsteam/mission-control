import { useEffect } from "react";
import RoverSocketManager from "../networking/RoverSocketManager";
import GamepadController from "../input/GamepadController";
import KeyboardController from "../input/KeyboardController";
import Sidebar from "../sidebar/Sidebar";
import PanelContainer from "../panelContainer/PanelContainer";
import "./App.css";

function App() {
  // Disable context menu.
  useEffect(() => {
    const handleContextMenu = event => event.preventDefault();
    document.addEventListener("contextmenu", handleContextMenu);
  }, []);

  return (
    <div className="app">
      <RoverSocketManager />
      <GamepadController gamepadName="driveGamepad" gamepadIndex={0} />
      <GamepadController gamepadName="peripheralGamepad" gamepadIndex={1} />
      <KeyboardController />
      <Sidebar />
      <PanelContainer />
    </div>
  );
}

export default App;
