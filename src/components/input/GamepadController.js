import { Fragment } from "react";
import Gamepad from "react-gamepad";
import { useDispatch } from "react-redux";
import { gamepadConnected, gamepadDisconnected, gamepadAxisChanged, gamepadButtonChanged } from "../../features/inputSlice"

function GamepadController({ gamepadName, gamepadIndex }) {
  const dispatch = useDispatch();
  return (
    <Gamepad
      gamepadIndex={gamepadIndex}
      onConnect={() => dispatch(gamepadConnected({ gamepadName }))}
      onDisconnect={() => dispatch(gamepadDisconnected({ gamepadName }))}
      onAxisChange={(axisName, value) => dispatch(gamepadAxisChanged({
        gamepadName,
        axisName,
        value
      }))}
      onButtonChange={(buttonName, down) => dispatch(gamepadButtonChanged({
        gamepadName,
        buttonName,
        down
      }))}
    >
      {/* Due to a bug in react-gamepad, we must supply a child component. */}
      <Fragment />
    </Gamepad>
  );
}

export default GamepadController;
