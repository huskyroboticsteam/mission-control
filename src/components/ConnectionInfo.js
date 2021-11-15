import "./ConnectionInfo.css";
import SignalCellularAltIcon from "@material-ui/icons/SignalCellularAlt";

function ConnectionInfo({ connected }) {
  if (connected) {
    return (
      <div className="connectionInfo--connected">
        <SignalCellularAltIcon
          className="connectionInfo__icon"
          fontSize="large"
        />
        <p>Connected to rover</p>
      </div>
    );
  } else {
    return (
      <div className="connectionInfo--disconnected">
        <SignalCellularAltIcon
          className="connectionInfo__icon"
          fontSize="large"
        />
        <p>Disconnected from rover</p>
      </div>
    );
  }
}

export default ConnectionInfo;
