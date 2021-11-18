import { useState } from "react";
import Sidebar from "./main/Sidebar";
import MainView from "./main/MainView";
import InputManager from "./input/InputManager";
import Socket from "./network/Socket";
import "./App.css";

const initialUserInput = {
  driveX: 0,
  driveY: 0
}

function App() {
  const [roverConnected, setRoverConnected] = useState(false);
  const [gamepad1Connected, setGamepad1Connected] = useState(false);
  const [gamepad2Connected, setGamepad2Connected] = useState(false);
  const [userInput, setUserInput] = useState(initialUserInput);

  return (
    <div className="app">
      <Sidebar roverConnected={roverConnected} gamepad1Connected={gamepad1Connected} gamepad2Connected={gamepad2Connected} />
      <MainView />
      <Socket setRoverConnected={setRoverConnected} userInput={userInput} onReceiveMessage={handleRoverMessage} />
      <InputManager
        setGamepad1Connected={setGamepad1Connected}
        setGamepad2Connected={setGamepad2Connected}
        setUserInput={setUserInput}
      />
    </div >
  );
}

function handleRoverMessage() {
  // TODO
}

export default App;
