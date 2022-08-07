import Gamepad from "react-gamepad";
import { useDispatch } from "react-redux";
import {
  gamepadConnected,
  gamepadDisconnected,
  gamepadAxisChanged,
  gamepadButtonChanged
} from "../../store/inputSlice";

const crossPlatformLayout = {
  buttons: [
    "A",
    "B",
    "X",
    "Y",
    "LB",
    "RB",
    "LT",
    "RT",
    "Back",
    "Start",
    "LS",
    "RS",
    "DPadUp",
    "DPadDown",
    "DPadLeft",
    "DPadRight",
  ],
  axis: [
    "LeftStickX",
    "-LeftStickY",
    "RightStickX",
    "-RightStickY",
    "DPadX",
    "-DPadY",
    "LeftTrigger",
    "RightTrigger",
  ],
  buttonAxis: [
    null,
    null,
    null,
    null,
    null,
    null,
    "LeftTrigger",
    "RightTrigger",
  ],
}

function GamepadController({ gamepadName, gamepadIndex }) {
  const dispatch = useDispatch();
  return (
    <Gamepad
      layout={crossPlatformLayout}
      gamepadIndex={gamepadIndex}
      onConnect={() => dispatch(gamepadConnected({ gamepadName }))}
      onDisconnect={() => dispatch(gamepadDisconnected({ gamepadName }))}
      onAxisChange={(axisName, value) => dispatch(gamepadAxisChanged({
        gamepadName,
        axisName,
        value
      }))}
      onButtonChange={(buttonName, pressed) => dispatch(gamepadButtonChanged({
        gamepadName,
        buttonName,
        pressed
      }))}
    >
      {/* Due to a bug in react-gamepad, we must supply a child component. */}
      <></>
    </Gamepad>
  );
}

export default GamepadController;
