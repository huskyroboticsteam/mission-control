import { useDispatch, useSelector } from "react-redux";
import { selectMotorsAreEnabled, enableMotors } from "../../store/motorsSlice";
import "./EnableMotorsButton.css";

function EnableMotorsButton() {
  const dispatch = useDispatch();
  const motorsEnabled = useSelector(selectMotorsAreEnabled);

  const handleClick = () => {
    dispatch(enableMotors({ enabled: !motorsEnabled }));
  };

  const className = "enable-motors-button enable-motors-button--" +
    (motorsEnabled ? "enabled" : "disabled");
  const text = motorsEnabled ? "Disable Motors" : "Enable Motors";

  return (
    <div className={className}>
      <button onClick={handleClick}>{text}</button>
    </div>
  );
}

export default EnableMotorsButton;
