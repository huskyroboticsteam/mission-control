import { useDispatch, useSelector } from "react-redux";
import { requestOpMode, selectOpMode } from "../../store/opModeSlice";
import "./OpModeSelect.css";
import { selectRoverPosition } from "../../store/telemetrySlice";


function sanitize(num, decimals) {
  if (num == null) {
    return "N/A";
  }

  let ret = num.toString();
  if (decimals !== undefined) {
    ret = num.toFixed(decimals);
  }

  return num >= 0 ? " " + ret : ret;
}

function OpModeSelect() {
    const dispatch = useDispatch();
    const opMode = useSelector(selectOpMode);
    const {lon, lat } = useSelector(selectRoverPosition);
  
    const handleClick = () => {
      if (opMode === "teleoperation") {
        dispatch(requestOpMode({ mode: "autonomous" }));
      } else if (opMode === "autonomous") {
        dispatch(requestOpMode({ mode: "teleoperation" }));
      }
    };

    


    
  
    return (
      <div className={`op-mode-select op-mode-select--${opMode}`}>
        <p>
          Current operation mode: <span className={`op-mode-select__op-mode op-mode-select__op-mode--${opMode}`}>{opMode}</span>
        </p>
        <button onClick={handleClick} >
          Switch to {opMode === "teleoperation" ? "Autonomous" : "Teleoperation"}
        </button>
        {
          opMode === "autonomous" ?
            <div className="nav-status">
              <p>Longitude: {sanitize(lon)}</p>
              <p>Latitude: {sanitize(lat)}</p>
            </div>
          : <></>
        }
        
      </div >
    );
  }

export default OpModeSelect;
