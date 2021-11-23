import { useRef, useEffect, Fragment } from "react";

function KeyboardControls({ userInput, setUserInput }) {
  const pressedKeysRef = useRef([]);
  useEffect(() => addKeyboardListeners(pressedKeysRef, userInput, setUserInput),
    [userInput, setUserInput]);

  // We don't need to render anything.
  return <Fragment />;
}

function addKeyboardListeners(pressedKeysRef, userInput, setUserInput) {
  const handleKeyDown = (ev) => {
    const pressedKey = ev.key;
    if (!pressedKeysRef.current.includes(pressedKey)) {
      pressedKeysRef.current = [...pressedKeysRef.current, pressedKey];
      updateUserInput(pressedKeysRef.current, userInput, setUserInput);
    }
  }

  const handleKeyUp = (ev) => {
    const releasedKey = ev.key;
    pressedKeysRef.current = pressedKeysRef.current.filter((key) => key !== releasedKey);
    updateUserInput(pressedKeysRef.current, userInput, setUserInput);
  }

  document.onkeydown = handleKeyDown;
  document.onkeyup = handleKeyUp;
}

function updateUserInput(pressedKeys, userInput, setUserInput) {
  const driveStraight = getAxis(pressedKeys, "ArrowUp", "ArrowDown");
  const driveSteer = getAxis(pressedKeys, "ArrowRight", "ArrowLeft");
  const armBase = getAxis(pressedKeys, "q", "a");
  const shoulder = getAxis(pressedKeys, "w", "s");
  const elbow = getAxis(pressedKeys, "e", "d");

  const newUserInput = {
    driveStraight,
    driveSteer,
    armBase,
    shoulder,
    elbow
  }

  setUserInput(newUserInput);
}

function getAxis(pressedKeys, positiveKey, negativeKey) {
  let axis = 0;
  if (pressedKeys.includes(positiveKey)) {
    axis += 1;
  }
  if (pressedKeys.includes(negativeKey)) {
    axis -= 1;
  }
  return axis;
}

export default KeyboardControls;
