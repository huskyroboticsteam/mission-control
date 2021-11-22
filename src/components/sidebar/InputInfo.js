import KeyboardIcon from "@material-ui/icons/Keyboard";
import GamepadIcon from "@material-ui/icons/SportsEsports";
import "./InputInfo.css";

function InputInfo({ keyboardConnected, driveGamepadConnected, armGamepadConnected }) {
  return (
    <div className="inputInfo">
      <KeyboardInfo connected={keyboardConnected} />
      <GamepadInfo label="Driver" connected={driveGamepadConnected} />
      <GamepadInfo label="Arm" connected={armGamepadConnected} />
    </div>
  );
}

function KeyboardInfo({ connected }) {
  const className = connected ?
    "inputInfo__info--connected" :
    "inputInfo__info--disconnected";
  return (
    <div className={className}>
      <KeyboardIcon fontSize="large" className={className} />
      <p>Keyboard Controls</p>
    </div>
  );
}

function GamepadInfo({ label, connected }) {
  const className = connected ?
    "inputInfo__info--connected" :
    "inputInfo__info--disconnected";
  return (
    <div className={className}>
      <GamepadIcon fontSize="large" className={className} />
      <p>{label + " Gamepad"}</p>
    </div>
  );
}

export default InputInfo;
