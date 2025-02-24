export const keyboardMap = {
  drive: {
    title: "Drive Controls",
    controls: {
      "Arrow Keys": {
        description: "Drive Control (Tank Mode)",
        mapping: {
          "ARROWUP": ["straight+", "right+"],
          "ARROWDOWN": ["straight-", "left+"],
          "ARROWLEFT": ["steer-", "left+"],
          "ARROWRIGHT": ["steer+", "right+"]
        }
      },
      "Space": {
        description: "Toggle Tank/Swerve Drive",
        mapping: "toggleTankDrive"
      },
      "Shift": {
        description: "Precision Control",
        mapping: "precision"
      }
    }
  },
  arm: {
    title: "Arm Controls",
    controls: {
      "W/S": {
        description: "Shoulder Joint",
        mapping: {
          "W": "shoulder+",
          "S": "shoulder-"
        }
      },
      "A/D": {
        description: "Arm Base",
        mapping: {
          "A": "armBase-",
          "D": "armBase+"
        }
      },
      "T/G": {
        description: "Elbow Joint",
        mapping: {
          "T": "elbow+",
          "G": "elbow-"
        }
      },
      "F/H": {
        description: "Forearm",
        mapping: {
          "F": "forearm-",
          "H": "forearm+"
        }
      },
      "I/K": {
        description: "Wrist Pitch",
        mapping: {
          "I": "wristPitch+",
          "K": "wristPitch-"
        }
      },
      "U/O": {
        description: "Wrist Roll",
        mapping: {
          "U": "wristRoll-",
          "O": "wristRoll+"
        }
      },
      "J/L": {
        description: "Hand",
        mapping: {
          "J": "hand-",
          "L": "hand+"
        }
      },
      ",/.": {
        description: "Hand Actuator",
        mapping: {
          ",": "handActuator-",
          ".": "handActuator+"
        }
      }
    }
  },
  science: {
    title: "Science Controls",
    controls: {
      "B": {
        description: "Toggle Drill Motor",
        mapping: "toggleDrill"
      }
    }
  }
}; 