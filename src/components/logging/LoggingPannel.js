import { useDispatch, useSelector } from "react-redux";
import { selectLogLevel, selectLogEntries, setLogLevel } from "../../store/loggingSlice";
import "./LoggingPanel.css";

function LoggingPanel() {
  const dispatch = useDispatch();

  const logLevel = useSelector(selectLogLevel);
  const logEntries = useSelector(selectLogEntries);

  const handleLogLevelChange = event => dispatch(setLogLevel({
    logLevel: event.target.value
  }));

  return (
    <div className="logging-panel">
      <div>
        {logEntries.map(logEntry => (
          <LogEntryView key={logEntry} logEntry={logEntry} />
        ))}
      </div>
      <div className="logging-panel__log-level-select">
        Log level:
        <select value={logLevel} onChange={handleLogLevelChange}>
          <option value="trace">Trace</option>
          <option value="debug">Debug</option>
          <option value="info">Info</option>
          <option value="warn">Warn</option>
          <option value="error">Error</option>
        </select>
      </div>
    </div>
  );
}

function LogEntryView({ logEntry }) {
  const { logLevel, message, timestamp } = logEntry
  const className = `logging-panel__entry logging-panel__entry--${logLevel}`;
  const date = new Date(timestamp);
  return (
    <div className={className}>
      {`${date.getHours()}:${date.getMinutes()}:${date.getSeconds()} ${logLevel.toUpperCase()} ${message}`}
    </div>
  )
}

export default LoggingPanel;
