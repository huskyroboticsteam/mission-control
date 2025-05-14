import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { keyPressed, keyReleased } from "../../store/inputSlice";

function KeyboardController() {
  const dispatch = useDispatch()
  useEffect(() => {
    const handleKeyDown = event => dispatch(keyPressed({ key: event.key }));
    const handleKeyUp = event => dispatch(keyReleased({ key: event.key }));

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, [dispatch]);

  // We don't need to render this component.
  return null;
}

export default KeyboardController;
