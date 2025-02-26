export const keyboardMap = {
  drive: {
    title: "Drive Controls",
    joints: {
      straight: {
        description: "Forward/Backward",
        controls: {
          ARROWUP: "+",
          ARROWDOWN: "-",
        },
      },
      steer: {
        description: "Turn Left/Right",
        controls: {
          ARROWLEFT: "-",
          ARROWRIGHT: "+",
        },
      },
    },
    special: {
      toggleTankDrive: {
        description: "Toggle Tank/Normal Drive",
        control: "SPACE",
      },
      precision: {
        description: "Precision Control",
        control: "SHIFT",
      },
    },
  },
  arm: {
    title: "Arm Controls",
    joints: {
      armBase: {
        description: "Arm Base",
        controls: {
          A: "-",
          D: "+",
        },
      },
      shoulder: {
        description: "Shoulder Joint / IK Forward",
        controls: {
          W: "+",
          S: "-",
        },
      },
      elbow: {
        description: "Elbow Joint / IK Up",
        controls: {
          T: "+",
          G: "-",
        },
      },
      forearm: {
        description: "Forearm",
        controls: {
          F: "-",
          H: "+",
        },
      },
      wristDiffLeft: {
        description: "Wrist Diff Left",
        controls: {
          I: "+",
          K: "-",
        },
      },
      wristDiffRight: {
        description: "Wrist Diff Right",
        controls: {
          U: "-",
          O: "+",
        },
      },
      hand: {
        description: "Hand",
        controls: {
          J: "-",
          L: "+",
        },
      },
      handActuator: {
        description: "Hand Actuator",
        controls: {
          ",": "-",
          ".": "+",
        },
      },
    },
  },
  science: {
    title: "Science Controls",
    special: {
      toggleDrillMotor: {
        description: "Drill Motor",
        control: "B",
      },
    },
  },
};

export const gamepadMap = {
  drive: {
    title: "Drive Gamepad Controls",
    joints: {
      straight: {
        normal: {
          LeftStickY: "-",
        },
      },
      steer: {
        normal: {
          RightStickX: "+",
        },
      },
      left: {
        tank: {
          LeftStickY: "+",
        },
      },
      right: {
        tank: {
          RightStickY: "+",
        },
      },
    },
    special: {
      precision: ["LB", "RB"],
    },
  },
  peripheral: {
    title: "Peripheral Gamepad Controls",
    joints: {
      armBase: {
        axes: {
          LeftStickX: "+",
        },
      },
      shoulder: {
        normal: {
          LeftStickY: "+",
        },
      },
      ikForward: {
        ik: {
          LeftStickY: "-",
        },
      },
      elbow: {
        normal: {
          RightStickY: "-",
        },
      },
      ikUp: {
        ik: {
          RightStickY: "-",
        },
      },
      forearm: {
        axes: {
          RightStickX: "+",
        },
      },
      hand: {
        axes: {
          LeftTrigger: "+",
          RightTrigger: "-",
        },
      },
      wristDiffLeft: {
        buttons: {
          DPadDown: "-",
          DPadUp: "+",
        },
      },
      wristDiffRight: {
        buttons: {
          DPadLeft: "-",
          DPadRight: "+",
        },
      },
      handActuator: {
        buttons: {
          B: "-",
          A: "+",
        },
      },
    },
    special: {
      precision: ["LB", "RB"],
    },
  },
};

export const inputMap = {
  keyboard: keyboardMap,
  gamepad: gamepadMap,
};
