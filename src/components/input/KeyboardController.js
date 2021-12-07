import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { keyPressed, keyReleased } from "../../features/inputSlice";

function KeyboardController() {
  const dispatch = useDispatch()
  useEffect(() => {
    document.addEventListener(
      "keydown",
      event => dispatch(keyPressed({ key: event.key }))
    );
    document.addEventListener(
      "keyup",
      event => dispatch(keyReleased({ key: event.key }))
    );
  }, [dispatch]);
  return null;
}

export default KeyboardController;
