import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { keyPressed, keyReleased } from "../../store/inputSlice";

function KeyboardController() {
  const dispatch = useDispatch();

  useEffect(() => {
    const handleKeyDown = event => {
      // Prevent default behavior for game control keys
      if (event.key !== 'F12' && event.key !== 'F5') {
        event.preventDefault();
      }
      dispatch(keyPressed({ key: event.key }));
    };
    
    const handleKeyUp = event => {
      if (event.key !== 'F12' && event.key !== 'F5') {
        event.preventDefault();
      }
      dispatch(keyReleased({ key: event.key }));
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, [dispatch]);

  return null;
}

export default KeyboardController;
