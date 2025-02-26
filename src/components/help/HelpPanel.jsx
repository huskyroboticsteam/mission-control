import "./HelpPanel.css";
import { useSelector } from 'react-redux';
import { keyboardMap } from '../../utils/controlMapping';
import standardDriveControls from "./standardDriveControls.png";
import tankDriveControls from "./tankDriveControls.png";
import armControls from "./armControls.png";

function HelpPanel() {
  const pressedKeys = useSelector(state => state.input.keyboard.pressedKeys);

  return (
    <div className="help-panel">
      <div className="controls-images">
        <img src={standardDriveControls} alt="standard drive controls" />
        <img src={tankDriveControls} alt="tank drive controls" />
        <img src={armControls} alt="arm controls" />
      </div>

      <div className="keyboard-mapping">
        <h3>Keyboard Controls</h3>
        {Object.entries(keyboardMap).map(([section, { title, controls }]) => (
          <div key={section} className="mapping-section">
            <h4>{title}</h4>
            <div className="controls-grid">
              {Object.entries(controls).map(([keys, control]) => (
                <div 
                  key={keys} 
                  className={`control-item ${
                    keys.split('/').some(key => 
                      pressedKeys.includes(key.toUpperCase())
                    ) ? 'active' : ''
                  }`}
                >
                  <span className="keys">{keys}</span>
                  <span className="action">{control.description}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HelpPanel;
