import { useSelector } from "react-redux";
import { useEffect, useRef } from "react";
import { selectMessageLog } from "../../store/roverSocketSlice";
import "./MessageLog.css";

function MessageLog() {
  const messages = useSelector(selectMessageLog);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getStatusColor = (type) => {
    return type === "error" ? "red" : "inherit";
  };

  return (
    <div className="message-log">
      <h3>Message Log</h3>
      <div className="message-container">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message ${msg.type}`}
            style={{ borderLeft: `4px solid ${getStatusColor(msg.type)}` }}
          >
            <span className="timestamp">{msg.timestamp}</span>
            <span className="direction">{msg.direction}:</span>
            <span
              className="content"
              style={{ color: getStatusColor(msg.type) }}
            >
              {JSON.stringify(msg.content)}
            </span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}

export default MessageLog;
