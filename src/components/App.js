import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { connectToRover, disconnectFromRover } from "../features/roverSlice";
import { ROVER_SERVER_URL } from "../constants/network";
import GamepadController from "./input/GamepadController";
import KeyboardController from "./input/KeyboardController";
import Sidebar from "./sidebar/Sidebar";
import PanelContainer from "./panelContainer/PanelContainer";
import "./App.css";

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(connectToRover({ url: ROVER_SERVER_URL }));
    return () => {
      dispatch(disconnectFromRover());
    }
  }, [dispatch]);

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
