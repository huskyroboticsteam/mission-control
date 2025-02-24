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

  const formatContent = (content) => {
    try {
      if (typeof content === 'string') {
        return content;
      }
      return JSON.stringify(content, null, 2);
    } catch (e) {
      return String(content);
    }
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
            <div className="message-header">
              <span className="timestamp">{msg.timestamp}</span>
              <span className="direction">{msg.direction}</span>
            </div>
            <pre
              className="content"
              style={{ color: getStatusColor(msg.type) }}
            >
              {formatContent(msg.content)}
            </pre>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}

export default MessageLog;
