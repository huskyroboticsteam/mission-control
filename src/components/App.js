import Sidebar from "./main/Sidebar";
import MainView from "./main/MainView";
import InputManager from "./input/InputManager";
import { useState } from "react";
import Socket from "./network/Socket";
import "./App.css";

function App() {
  const [gamepad1Connected, setGamepad1Connected] = useState(false);
  const [gamepad2Connected, setGamepad2Connected] = useState(false);

  return (
    <div className="app">
      <Sidebar gamepad1Connected={gamepad1Connected} gamepad2Connected={gamepad2Connected} />
      <MainView />
      <Socket />
      <InputManager setGamepad1Connected={setGamepad1Connected} setGamepad2Connected={setGamepad2Connected} />
    </div >
  );
}

export default App;
