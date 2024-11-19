import { useDispatch, useSelector } from "react-redux";
import { requestOpMode, selectOpMode } from "../../store/opModeSlice";
import "./OpModeSelect.css";
import { selectRoverPosition } from "../../store/telemetrySlice";
import { selectLatitude, selectLongitude } from "../../store/waypointNavSlice";

// Constants for navigation
const POSITION_THRESHOLD = 0.0001; // Roughly 11 meters at the equator

function calculateDistance(lat1, lon1, lat2, lon2) {
  // Using absolute difference for a simple distance check
  const latDiff = Math.abs(lat1 - lat2);
  const lonDiff = Math.abs(lon1 - lon2);
  return Math.sqrt(latDiff * latDiff + lonDiff * lonDiff);
}

function sanitize(num, decimals) {
  if (num == null) {
    return "N/A";
  }
  if (decimals !== undefined) {
    ret = num.toFixed(decimals);
  }

  return num >= 0 ? " " + ret : ret;
}

function OpModeSelect() {
  const dispatch = useDispatch();
  const opMode = useSelector(selectOpMode);
  const { lon, lat } = useSelector(selectRoverPosition);
  const targetLatitude = useSelector(selectLatitude);
  const targetLongitude = useSelector(selectLongitude);

  const handleClick = () => {
    if (opMode === "teleoperation") {
      dispatch(requestOpMode({ mode: "autonomous" }));
    } else if (opMode === "autonomous") {
      dispatch(requestOpMode({ mode: "teleoperation" }));
    }
  };

  const hasReachedWaypoint = () => {
    // Guard against null or undefined values
    if (!lon || !lat || !targetLatitude || !targetLongitude) {
      return false;
    }

    const distance = calculateDistance(
      lat,
      lon,
      targetLatitude,
      targetLongitude
    );

    return distance <= POSITION_THRESHOLD;
  };

  return (
    <div className={`op-mode-select op-mode-select--${opMode}`}>
      <p>
        Current operation mode:{" "}
        <span className={`op-mode-select__op-mode op-mode-select__op-mode--${opMode}`}>
          {opMode}
        </span>
      </p>
      <button onClick={handleClick}>
        Switch to {opMode === "teleoperation" ? "Autonomous" : "Teleoperation"}
      </button>
      {opMode === "autonomous" && (
        <div className="nav-status">
          {hasReachedWaypoint() ? <p>reached</p> : <p>reaching...</p>}
        </div>
      )}
      <div>Testing if I get Target Longitude: {targetLongitude}</div>
      <div>Testing if I get Target Longitude: {targetLatitude}</div>
    </div>
  );
}

export default OpModeSelect;
