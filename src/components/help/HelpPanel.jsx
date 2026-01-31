import './HelpPanel.css'
import { GamepadApiWrapper } from "virtual-gamepad-lib/GamepadApiWrapper";
import { GamepadEmulator, DEFAULT_GPAD_BUTTON_COUNT, DEFAULT_GPAD_AXIS_COUNT } from "virtual-gamepad-lib/GamepadEmulator";
import { GamepadDisplay } from "virtual-gamepad-lib/GamepadDisplay";
import { gamepadButtonType, gamepadDirection, gamepadEmulationState, PRESET_SVG_GPAD_BTN_IDS, PRESET_SVG_GPAD_BTN_TAP_TARGET_IDS, PRESET_SVG_GPAD_CLASS, standardGpadButtonMap } from "virtual-gamepad-lib/enums";
import { CenterTransformOrigin } from "virtual-gamepad-lib/utilities";
import React, { useState, useRef, useEffect } from "react";
import Gamepad from './Gamepad.jsx';
import FULL_GPAD_SVG_SOURCE_CODE from "virtual-gamepad-lib/gamepad_assets/rounded/display-gamepad-full.svg?raw";

function FullGpad() {
  return (
    <div>
      <Gamepad style={{ width: 200, height: 200}}
      dangerouslySetInnerHTML={{ __html: FULL_GPAD_SVG_SOURCE_CODE }}/>
    </div>
  );
}

function addEmulatedGamepad(overlay, index, gpadEmulator) {
        if (overlay) {
            // add an emulated gamepad at the provided index with overlayMode on.
            gpadEmulator.AddEmulatedGamepad(index, true, DEFAULT_GPAD_BUTTON_COUNT, DEFAULT_GPAD_AXIS_COUNT); // returns the new (emulated) gamepad or false if some error happened.
        }
        else {
            // add an emulated Gamepad at the next available index (indicated by -1) with overlayMode off.
            gpadEmulator.AddEmulatedGamepad(-1, false, DEFAULT_GPAD_BUTTON_COUNT, DEFAULT_GPAD_AXIS_COUNT); // returns the new (emulated) gamepad or false if some error happened.
        }
    }

function setupEmulatedGamepadInput(gpadIndex, display_gpad, gpadEmulator) {
        /* ----- SETUP BUTTON TOUCH INPUTS ----- */
        gpadEmulator.AddButtonTouchEventListeners(gpadIndex, PRESET_SVG_GPAD_BTN_TAP_TARGET_IDS.map((tapTargetId, i) => {
            const isTrigger = tapTargetId.includes("trigger");
            const isStick = tapTargetId.includes("stick");
            if (isTrigger) {
                // trigger buttons usually take variable pressure so can be represented by a variable button that is dragged down.
                return {
                    buttonIndex: i,
                    type: gamepadButtonType.variable,
                    dragDistance: 50, // pixels that the user must drag the button down to fully press it.
                    lockTargetWhilePressed: true,
                    directions: {
                        [gamepadDirection.up]: false,
                        [gamepadDirection.down]: true,
                        [gamepadDirection.left]: false,
                        [gamepadDirection.right]: false,
                    }
                };
            }
            else {
                return {
                    buttonIndex: i,
                    type: gamepadButtonType.onOff,
                    lockTargetWhilePressed: (isStick === true),
                };
            }
        }));
        /* ----- SETUP JOYSTICK TOUCH INPUTS ----- */
        gpadEmulator.AddJoystickTouchEventListeners(gpadIndex, [
            {
                // left joystick (we re-use the same tap target id as the button for clicking the left stick)
                dragDistance: 30, // pixels that the user must drag the joystic to represent + 1 (or in reverse to represent minus one).
                xAxisIndex: 0,
                yAxisIndex: 1,
                lockTargetWhilePressed: true,
                directions: {
                    [gamepadDirection.up]: true,
                    [gamepadDirection.down]: true,
                    [gamepadDirection.left]: true,
                    [gamepadDirection.right]: true,
                },
            },
            {
                // right joystick (we re-use the same tap target id as the button for clicking the right stick)
                dragDistance: 30, // pixels that the user must drag the joystic to represent + 1 (or in reverse to represent minus one).
                xAxisIndex: 2,
                yAxisIndex: 3,
                lockTargetWhilePressed: true,
                directions: {
                    [gamepadDirection.up]: true,
                    [gamepadDirection.down]: true,
                    [gamepadDirection.left]: true,
                    [gamepadDirection.right]: true,
                },
            }
        ]);
    }


function HelpPanel() {
  return (
    <div className="help-panel">
      <FullGpad />
    </div>
  )
}

export default HelpPanel;

