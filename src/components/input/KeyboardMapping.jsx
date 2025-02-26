import React from "react";
import { keyboardMap } from "../../utils/controlMapping";
import { useSelector } from "react-redux";

function KeyboardMapping() {
  const pressedKeys = useSelector((state) => state.input.keyboard.pressedKeys);

  const renderControls = (section) => {
    if (!section) return [];
    const controls = [];

    if (section.joints) {
      Object.entries(section.joints).forEach(([joint, config]) => {
        if (!config?.controls) return;
        const keys = Object.keys(config.controls).join("/");
        const isActive = Object.keys(config.controls).some((key) =>
          pressedKeys.includes(key)
        );
        controls.push(
          <div
            key={keys}
            className={`control-item ${isActive ? "active" : ""}`}
          >
            <span className="keys">{keys}</span>
            <span className="action">
              {config.description || "No description"}
            </span>
          </div>
        );
      });
    }

    if (section.special) {
      Object.entries(section.special).forEach(([name, config]) => {
        if (!config?.control) return;
        const isActive = pressedKeys.includes(config.control);

        controls.push(
          <div
            key={config.control}
            className={`control-item ${isActive ? "active" : ""}`}
          >
            <span className="keys">{config.control}</span>
            <span className="action">
              {config.description || "No description"}
            </span>
          </div>
        );
      });
    }

    return controls;
  };

  return (
    <div className="keyboard-mapping">
      <h3>Keyboard Controls</h3>
      {Object.entries(keyboardMap || {}).map(([title, section]) => (
        <div key={title} className="mapping-section">
          <h4>{title}</h4>
          <div className="controls-grid">{renderControls(section)}</div>
        </div>
      ))}
    </div>
  );
}

export default KeyboardMapping;
