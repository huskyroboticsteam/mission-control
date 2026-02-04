import './HelpPanel.css'
import { GamepadApiWrapper } from "virtual-gamepad-lib/GamepadApiWrapper";
import { GamepadEmulator, DEFAULT_GPAD_BUTTON_COUNT, DEFAULT_GPAD_AXIS_COUNT } from "virtual-gamepad-lib/GamepadEmulator";
import { GamepadDisplay } from "virtual-gamepad-lib/GamepadDisplay";
import { gamepadButtonType, gamepadDirection, gamepadEmulationState, PRESET_SVG_GPAD_BTN_IDS, PRESET_SVG_GPAD_BTN_TAP_TARGET_IDS, PRESET_SVG_GPAD_CLASS, standardGpadButtonMap } from "virtual-gamepad-lib/enums";
import { CenterTransformOrigin } from "virtual-gamepad-lib/utilities";
import React, { useState, useRef, useEffect } from "react";
import GamepadSvg from './GamepadSvg.jsx';
import FULL_GPAD_SVG_SOURCE_CODE from "virtual-gamepad-lib/gamepad_assets/rounded/display-gamepad-full.svg?raw";
import { setupPresetInteractiveGamepad } from 'virtual-gamepad-lib/helpers';

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
                    tapTarget: display_gpad.querySelector("#" + tapTargetId),
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
                    tapTarget: display_gpad.querySelector("#" + tapTargetId)
                };
            }
        }));
        /* ----- SETUP JOYSTICK TOUCH INPUTS ----- */
        gpadEmulator.AddJoystickTouchEventListeners(gpadIndex, [
            {
                // left joystick (we re-use the same tap target id as the button for clicking the left stick)
                tapTarget: display_gpad.querySelector("#" + PRESET_SVG_GPAD_BTN_TAP_TARGET_IDS[standardGpadButtonMap.LStick]),
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
                tapTarget: display_gpad.querySelector("#" + PRESET_SVG_GPAD_BTN_TAP_TARGET_IDS[standardGpadButtonMap.RStick]),
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
  const gamepadEmulator = useRef(null);
  const gamepadApiWrapper = useRef(null);
  const displayGpad = useRef(null);
  
  useEffect(() => {
    if (gamepadEmulator.current || gamepadApiWrapper.current) return;

    gamepadEmulator.current = new GamepadEmulator(0.1);
    gamepadApiWrapper.current = setupPresetInteractiveGamepad(displayGpad.current, {
      GpadEmulator: gamepadEmulator.current,
      AllowDpadDiagonals: true,
      EmulatedGamepadOverlayMode: true,
      gpadIndex: 0,
    });
    
    //new GamepadApiWrapper({ buttonConfigs: [], updateDelay: 0, axisDeadZone: 0.05 });
    gamepadEmulator.current.AddEmulatedGamepad(0, true, 18, 4);
    setupEmulatedGamepadInput(0, displayGpad.current, gamepadEmulator.current);
  }, []);


  return (
    <div className="help-panel">
      <div className="gamepad-1" ref ={displayGpad} dangerouslySetInnerHTML={{__html: FULL_GPAD_SVG_SOURCE_CODE}}>
      </div>
    </div>
  )
}

export default HelpPanel;