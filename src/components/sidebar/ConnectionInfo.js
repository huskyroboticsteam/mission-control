import { useSelector } from "react-redux";
import ConnectionIcon from "@material-ui/icons/SignalCellularAlt";
import { selectRoverIsConnected } from "../../store/roverSocketSlice";
import "./ConnectionInfo.css";

function ConnectionInfo() {
  const roverIsConnected = useSelector(selectRoverIsConnected);
  if (roverIsConnected) {
    return (
      <div className="connection-info connection-info--connected">
        <ConnectionIcon fontSize="large" />
        <p>Connected to rover</p>
      </div>
    );
  } else {
    return (
      <div className="connection-info connection-info--disconnected">
        <ConnectionIcon fontSize="large" />
        <p>Rover not connected</p>
      </div>
    );
  }
}

export default ConnectionInfo;
