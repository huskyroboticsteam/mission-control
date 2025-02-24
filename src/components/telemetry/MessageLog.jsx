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

  return (
    <div className="message-log">
      <h3>Message Log</h3>
      <div className="message-container">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.type}`}>
            <span className="timestamp">{msg.timestamp}</span>
            <span className="direction">{msg.direction}:</span>
            <span className="content">{JSON.stringify(msg.content)}</span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}

export default MessageLog; 