export const keyboardMap = {
  drive: {
    title: "Drive Controls",
    controls: {
      "Arrow Keys": {
        description: "Drive Control",
        mapping: {
          ARROWUP: ["straight+"],
          ARROWDOWN: ["straight-"],
          ARROWLEFT: ["steer-"],
          ARROWRIGHT: ["steer+"],
        },
      },
      Space: {
        description: "Toggle Tank/Normal Drive",
        mapping: "toggleTankDrive",
      },
      Shift: {
        description: "Precision Control",
        mapping: "precision",
      },
    },
  },
  arm: {
    title: "Arm Controls",
    controls: {
      "W/S": {
        description: "Shoulder Joint / IK Forward",
        mapping: {
          W: "shoulder+",
          S: "shoulder-",
        },
      },
      "A/D": {
        description: "Arm Base",
        mapping: {
          A: "armBase-",
          D: "armBase+",
        },
      },
      "T/G": {
        description: "Elbow Joint / IK Up",
        mapping: {
          T: "elbow+",
          G: "elbow-",
        },
      },
      "F/H": {
        description: "Forearm",
        mapping: {
          F: "forearm-",
          H: "forearm+",
        },
      },
      "I/K": {
        description: "Wrist Diff Left",
        mapping: {
          I: "wristDiffLeft+",
          K: "wristDiffLeft-",
        },
      },
      "U/O": {
        description: "Wrist Diff Right",
        mapping: {
          U: "wristDiffRight-",
          O: "wristDiffRight+",
        },
      },
      "J/L": {
        description: "Hand",
        mapping: {
          J: "hand-",
          L: "hand+",
        },
      },
      ",/.": {
        description: "Hand Actuator",
        mapping: {
          ",": "handActuator-",
          ".": "handActuator+",
        },
      },
    },
  },
  science: {
    title: "Science Controls",
    controls: {
      B: {
        description: "Drill Motor",
        mapping: "toggleDrillMotor",
      },
    },
  },
};

export const gamepadMap = {
  drive: {
    title: "Drive Gamepad Controls",
    axes: {
      LeftStickY: "straight-",
      RightStickX: "steer+",
    },
    tankAxes: {
      LeftStickY: "left+",
      RightStickY: "right+",
    },
    buttons: {
      LB: "precision",
      RB: "precision",
    },
  },
  peripheral: {
    title: "Peripheral Gamepad Controls",
    axes: {
      LeftStickX: "armBase+",
      LeftStickY: {
        normal: "shoulder+",
        ik: "ikForward-",
      },
      RightStickY: {
        normal: "elbow-",
        ik: "ikUp-",
      },
      RightStickX: "forearm+",
      LeftTrigger: "hand+",
      RightTrigger: "hand-",
    },
    buttons: {
      DPadDown: "wristDiffLeft-",
      DPadUp: "wristDiffLeft+",
      DPadLeft: "wristDiffRight-",
      DPadRight: "wristDiffRight+",
      B: "handActuator-",
      A: "handActuator+",
      LB: "precision",
      RB: "precision",
    },
  },
};

export const inputMap = {
  keyboard: keyboardMap,
  gamepad: gamepadMap,
};
