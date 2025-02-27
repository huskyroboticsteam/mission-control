import React from "react";
import { gamepadMap } from "../../utils/controlMapping";
import { useSelector } from "react-redux";

function ControllerMapping() {
  const driveGamepadState = useSelector((state) => state.input.driveGamepad);
  const peripheralGamepadState = useSelector((state) => state.input.peripheralGamepadState);

  const renderControls = (section, gamepadState) => {
    if (!section) return [];
    const controls = [];

      Object.entries(section.joints).forEach(([joint, config]) => {
        const controlEntries = [];

        if (config.normal) {
          Object.entries(config.normal).forEach(([input, direction]) => {
            controlEntries.push([input, direction]);
          });
        }
        if (config.tank) {
          Object.entries(config.tank).forEach(([input, direction]) => {
            controlEntries.push([input, direction]);
          });
        }
        if (config.axes) {
          Object.entries(config.axes).forEach(([input, direction]) => {
            controlEntries.push([input, direction]);
            const axisValue = gamepadState?.axes?.[input];
            if (axisValue !== undefined) {
              controls.push(
                <div className="axis-control" key={`axis-${input}`}>
                  <span className="axis-label">{input}</span>
                  <div className="axis-bar" style={{ width: `${Math.abs(axisValue) * 100}%`, backgroundColor: axisValue > 0 ? 'green' : 'red' }} />
                </div>
              );
            }
          });
        }
        if (config.buttons) {
          Object.entries(config.buttons).forEach(([input, direction]) => {
            controlEntries.push([input, direction]);
          });
        }

        if (controlEntries.length > 0) {
          const inputs = controlEntries.map(([input]) => input).join("/");
          const isActive = controlEntries.some(([input]) => {
            return (
              (input !== undefined && gamepadState[input] !== undefined && (Math.abs(gamepadState[input]) > 0.1)) ||
              gamepadState[input]?.pressed
            );
          });

          controls.push(
            <div
              key={inputs}
              className={`control-item ${isActive ? "active" : ""}`}
            >
              <span className="keys">{inputs}</span>
              <span className="action">{joint}</span>
            </div>
          );
        }
      });

    if (section.special) {
      Object.entries(section.special).forEach(([name, inputs]) => {
        const isActive = inputs.some((input) => {
          return gamepadState[input];
        });

        controls.push(
          <div
            key={name}
            className={`control-item ${isActive ? "active" : ""}`}
          >
            <span className="keys">{inputs.join("/")}</span>
            <span className="action">{name}</span>
          </div>
        );
      });
    }

    return controls;
  };

  return (
    <div className="controller-mapping">
      <div className="mapping-section">
        <h4>{gamepadMap.drive.title}</h4>
        <div className="controls-grid">
          {renderControls(gamepadMap.drive, driveGamepadState)}
        </div>
      </div>
      <div className="mapping-section">
        <h4>{gamepadMap.peripheral.title}</h4>
        <div className="controls-grid">
          {renderControls(gamepadMap.peripheral, peripheralGamepadState)}
        </div>
      </div>
    </div>
  );
}

export default ControllerMapping;
