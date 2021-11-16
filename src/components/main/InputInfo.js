import KeyboardIcon from "@material-ui/icons/Keyboard";
import GamepadIcon from "@material-ui/icons/Gamepad";
import "./InputInfo.css";

function InputInfo({ keyboardConnected, gamepad1Connected, gamepad2Connected }) {
  return (
    <div className="inputInfo">
      <KeyboardInfo connected={keyboardConnected} />
      <GamepadInfo label="Driver" connected={gamepad1Connected} />
      <GamepadInfo label="Arm" connected={gamepad2Connected} />
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
      <p>{label} Gamepad</p>
    </div>
  );
}

export default InputInfo;
