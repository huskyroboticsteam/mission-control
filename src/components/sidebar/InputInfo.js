import { useSelector } from "react-redux";
import KeyboardIcon from "@material-ui/icons/Keyboard";
import GamepadIcon from "@material-ui/icons/SportsEsports";
import { selectInputDeviceIsConnected } from "../../store/inputSlice";
import { selectMountedPeripheral } from '../../store/peripheralsSlice';
import "./InputInfo.css";

function InputInfo() {
  const keyboardIsConnected = useSelector(selectInputDeviceIsConnected("keyboard"));
  const driveGamepadIsConnected = useSelector(selectInputDeviceIsConnected("driveGamepad"));
  const peripheralGamepadIsConnected = useSelector(selectInputDeviceIsConnected("peripheralGamepad"));

  const mountedPeripheral = useSelector(selectMountedPeripheral);
  let peripheralGamepadLabel;
  if (mountedPeripheral === "arm")
    peripheralGamepadLabel = "Arm";
  else if (mountedPeripheral === "scienceStation")
    peripheralGamepadLabel = "Science";
  else
    peripheralGamepadLabel = "Peripheral";

  return (
    <div className="input-info">
      <KeyboardInfo connected={keyboardIsConnected} />
      <GamepadInfo label="Driver" connected={driveGamepadIsConnected} />
      <GamepadInfo label={peripheralGamepadLabel} connected={peripheralGamepadIsConnected} />
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
