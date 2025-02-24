import React from 'react';
import { keyboardMap } from '../../utils/keyboardMap';
import { useSelector } from 'react-redux';

function KeyboardMapping() {
  const pressedKeys = useSelector(state => state.input.keyboard.pressedKeys);

  return (
    <div className="keyboard-mapping">
      <h3>Keyboard Controls</h3>
      {Object.entries(keyboardMap).map(([section, { title, controls }]) => (
        <div key={section} className="mapping-section">
          <h4>{title}</h4>
          <div className="controls-grid">
            {Object.entries(controls).map(([keys, { description }]) => (
              <div 
                key={keys} 
                className={`control-item ${
                  keys.split('/').some(key => 
                    pressedKeys.includes(key.toUpperCase())
                  ) ? 'active' : ''
                }`}
              >
                <span className="keys">{keys}</span>
                <span className="action">{description}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default KeyboardMapping; 