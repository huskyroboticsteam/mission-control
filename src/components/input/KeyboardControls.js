import { useRef, useEffect } from "react";

function KeyboardControls({ userInput, setUserInput }) {
  const pressedKeysRef = useRef([]);
  useEffect(() => addKeyboardListeners(pressedKeysRef, userInput, setUserInput),
    [userInput, setUserInput]);
  return (
    <></>
  );
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
  const driveX = getAxis(pressedKeys, "ArrowLeft", "ArrowRight");
  const driveY = getAxis(pressedKeys, "ArrowUp", "ArrowDown");
  const armBase = getAxis(pressedKeys, "q", "a");
  const shoulder = getAxis(pressedKeys, "w", "s");
  const elbow = getAxis(pressedKeys, "e", "d");
  const forearm = getAxis(pressedKeys, "r", "f");
  const hand = getAxis(pressedKeys, "u", "j");

  let diffLeft;
  let diffRight;
  if (pressedKeys.includes("t")) {
    diffLeft = 1;
    diffRight = 1;
  } else if (pressedKeys.includes("g")) {
    diffLeft = -1;
    diffRight = -1;
  } else if (pressedKeys.includes("y")) {
    diffLeft = 1;
    diffRight = -1;
  } else if (pressedKeys.includes("h")) {
    diffLeft = -1;
    diffRight = 1;
  } else {
    diffLeft = 0;
    diffRight = 0;
  }

  const newUserInput = {
    driveX,
    driveY,
    armBase,
    shoulder,
    elbow,
    forearm,
    diffLeft,
    diffRight,
    hand
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
