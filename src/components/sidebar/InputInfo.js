import { useSelector } from "react-redux";
import KeyboardIcon from "@material-ui/icons/Keyboard";
import GamepadIcon from "@material-ui/icons/SportsEsports";
import { selectInputDeviceIsConnected } from "../../features/inputSlice";
import "./InputInfo.css";

function InputInfo() {
  const driveGamepadIsConnected = useSelector(selectInputDeviceIsConnected("driveGamepad"));
  const armGamepadIsConnected = useSelector(selectInputDeviceIsConnected("armGamepad"));
  const keyboardIsConnected = useSelector(selectInputDeviceIsConnected("keyboard"));

  return (
    <div className="input-info">
      <KeyboardInfo connected={keyboardIsConnected} />
      <GamepadInfo label="Driver" connected={driveGamepadIsConnected} />
      <GamepadInfo label="Arm" connected={armGamepadIsConnected} />
    </div>
  );
}

function KeyboardInfo({ connected }) {
  const className = "input-info__info " + (
    connected ?
      "input-info__info--connected" :
      "input-info__info--disconnected"
  );

  return (
    <div className={className}>
      <KeyboardIcon fontSize="large" className={className} />
      <p>Keyboard Controls</p>
    </div>
  );
}

function GamepadInfo({ label, connected }) {
  const className = "input-info__info " + (
    connected ?
      "input-info__info--connected" :
      "input-info__info--disconnected"
  );

  return (
    <div className={className}>
      <GamepadIcon fontSize="large" className={className} />
      <p>{label + " Gamepad"}</p>
    </div>
  );
}

export default InputInfo;
