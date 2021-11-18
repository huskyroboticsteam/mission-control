import { useState } from "react";
import Sidebar from "./main/Sidebar";
import MainView from "./main/MainView";
import InputManager from "./input/InputManager";
import Socket from "./network/Socket";
import "./App.css";

const initialUserInput = {
  driveX: 0,
  driveY: 0,
  armBase: 0,
  shoulder: 0,
  elbow: 0,
  forearm: 0,
  diffLeft: 0,
  diffRight: 0,
  hand: 0
};

function App() {
  const [roverConnected, setRoverConnected] = useState(false);
  const [stopEngaged, setStopEngaged] = useState(false);
  const [driveGamepadConnected, setDriveGamepadConnected] = useState(false);
  const [armGamepadConnected, setArmGamepadConnected] = useState(false);
  const [userInput, setUserInput] = useState(initialUserInput);

  return (
    <div className="app">
      <Sidebar
        roverConnected={roverConnected}
        stopEngaged={stopEngaged}
        setStopEngaged={setStopEngaged}
        driveGamepadConnected={driveGamepadConnected}
        armGamepadConnected={armGamepadConnected}
      />
      <MainView />
      <Socket
        setRoverConnected={setRoverConnected}
        stopEngaged={stopEngaged}
        setStopEngaged={setStopEngaged}
        userInput={userInput}
        onReceiveMessage={handleRoverMessage}
      />
      <InputManager
        setDriveGamepadConnected={setDriveGamepadConnected}
        setArmGamepadConnected={setArmGamepadConnected}
        userInput={userInput}
        setUserInput={setUserInput}
      />
    </div >
  );
}

function handleRoverMessage() {
  // TODO
}

export default App;
