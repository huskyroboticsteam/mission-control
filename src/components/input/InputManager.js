import KeyboardControls from "./KeyboardControls";
import GamepadControls from "./GamepadControls";
import { useEffect, useState } from "react";

const initialInput = {
  driveX: 0,
  driveY: 0
}

function InputManager({ setGamepad1Connected, setGamepad2Connected }) {
  const [input, setInput] = useState(initialInput);

  useEffect(handlInput, [input]);

  return (
    <>
      <KeyboardControls setInput={setInput} />
      <GamepadControls
        setGamepad1Connected={setGamepad1Connected}
        setGamepad2Connected={setGamepad2Connected}
        setInput={setInput} />
    </>
  );
}

function handlInput() {
  // TODO: send commands to rover.
}

export default InputManager;
