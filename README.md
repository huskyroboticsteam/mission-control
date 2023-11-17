# Mission Control
The user interface for remotely operating the Husky Robotics rover.

## Overview
Mission Control creates a WebSocket client to connect directly to the rover WebSocket server at the URL `ws://localhost:3001/mission-control`. Mission Control will automatically connect to the rover server and reconnect as needed, providing a visual indication of the connection status. Mission Control and the rover server communicate with each other by sending JSON objects termed *messages* over the WebSocket connection. Through these messages, Mission Control can request that the rover perform certain actions, such as drive with a specified velocity. Additionally, the rover server provides Mission Control with data such as camera streams and motor positions through these messages.

## Setup
1. Install Node.js.
    - **Windows and macOS**: Download and run [the installer](https://nodejs.org/en/download/) for your operating system.
    - **Linux**: Run `sudo apt install nodejs && sudo apt install npm` in your terminal.
2. Run `git clone https://github.com/huskyroboticsteam/mission-control.git` in your terminal to clone the Mission Control repository to your local storage.
3. Run `cd mission-control` to navigate into the repository.
4. Run `npm install` to install dependencies.

### Linux Users
Linux users must set up a udev rule to ensure that the gamepad mappings are correct:
```bash
./linux-config/setup.sh
```
If you are not using the purple Xbox controllers, you may have to change the udev rule or
configure the mappings yourself with `jstest-gtk` or `jscal`.

## Running Mission Control (For Real Robot)
1. Open your terminal in the `mission-control` directory.
2. Run `npm run build`
3. Run `serve -s build` (if it says no such command, run `npm install -g serve` and retry)
4. Ctrl+click on the url it prints in the box

## Running Mission Control (For Simulator)
1. Open your terminal in the `mission-control` directory.
2. Run `npm start` to start the React server. Mission Control will open in your web browser shortly.

## Controls

The rover can be operated through Mission Control with either a keyboard or two gamepads. The first gamepad provides controls for driving the rover. The second gamepad provides controls for operating the rover's arm. The control bindings are detailed below.
![Standard drive controls](/src/components/help/standardDriveControls.png)
![Tank drive controls](/src/components/help/tankDriveControls.png)
![Armo controls](/src/components/help/armControls.png)
![Keyboard controls](/src/components/help/keyboardControls.png)

<<<<<<< HEAD
## Messages (`v2024.0.01`)
=======
## Messages (`v2024.0.0`)
>>>>>>> 0e7d273fc1b5c1c89648b9c9e88e5b4654b07094
The JSON objects sent between Mission Control and the rover server are termed *messages*. Each message has a type property and a number of additional parameters depending on the type. The usage of each type of message is detailed below.

## Mounted Peripheral Report
### Description
Sent from the rover server to inform Mission Control of the peripheral currently mounted on the rover. This should be sent any time the rover server connects with Mission Control.

### Syntax
```
{
  type: "mountedPeripheralReport",
  peripheral: "arm" | null
}
```

### Parameters
- `peripheral` - the peripheral currently mounted on the rover, or `null` if none is mounted

## Emergency Stop Request
### Description
Sent from Mission Control to instruct the rover to toggle the emergency stop feature.

### Syntax
```
{
  type: "emergencyStopRequest",
  stop: boolean
}
```

### Parameters
- `stop` - `true` to engage the emergency stop, `false` to disengage the emergency stop

## Operation Mode Request
### Description
Sent from Mission Control to instruct the rover server to run with a specified operation mode.

### Syntax
```
{
  type: "operationModeRequest",
  mode: "teleoperation" | "autonomous"
}
```

### Parameters
- `mode` - the requested operation mode

## Drive Request
### Description
Sent from Mission Control to instruct the rover to drive with a specified straight and steer value.

### Syntax
```
{
  type: "driveRequest",
  straight: number,
  steer: number
}
```

### Parameters
- `straight` - straight component in [-1.0, 1.0], where positive means drive forward and negative means drive backward
- `steer` - steer component in [-1.0, 1.0], where positive means steer right and negative means steer left

## Tank Drive Request
### Description
Sent from Mission Control to instruct the rover to drive like a tank with a specified left and right value.

### Syntax
```
{
  type: "tankDriveRequest",
  left: number,
  right: number
}
```

### Parameters
- `left` - left component in [-1.0, 1.0], where positive means drive forward on the left side and negative means drive backward on the left side
- `right` - right component in [-1.0, 1.0], where positive means drive forward on the right side and negative means drive backward on the right side

## Holonomic Drive Request
### Description
Sent from Mission Control to instruct the rover to drive with holonomic capabilities
(i.e., it can rotate independently without requiring translational motion).

### Syntax
```
{
  type: "holonomicDriveRequest",
  straight: number,
  left: number,
  turnCCW: number
}
```
### Parameters
- `straight` - straight component in [-1.0, 1.0], where positive means drive forward and negative means drive backward
- `left` - left component in [-1.0, 1.0], where positive means drive left and negative means drive right
- `turnCCW` - turning component in [-1.0, 1.0], where positive means turning in the counterclockwise direction and negative means turning in the clockwise direction

## Joint Power Request
### Description
Sent from Mission Control to instruct the rover server to make a joint move with a specified power.

### Syntax
```
{
  type: "jointPowerRequest",
  joint: "armBase" | "shoulder" | "elbow" | "forearm" | "wrist" | "hand" | "drillArm" | "activeSuspension" | "ikForward" | "ikUp",
  power: number
}
```

### Parameters
- `joint` - the name of the joint
- `power` - the requested power in [-1, 1]

## Joint Position Request
### Description
Sent from Mission Control to instruct the rover server to make a joint move to a specified position.

### Syntax
```
{
  type: "jointPositionRequest",
  joint: "armBase" | "shoulder" | "elbow" | "forearm" | "wrist" | "hand" | "drillArm" | "activeSuspension" | "ikForward" | "ikUp",
  position: number
}
```

### Parameters
- `joint` - the name of the joint
- `position` - the requested position in degrees

## Joint Position Report
### Description
Sent from the rover server to inform Mission Control of a joint's current position.

### Syntax
```
{
  type: "jointPositionReport",
  joint: "armBase" | "shoulder" | "elbow" | "forearm" | "wrist" | "hand" | "drillArm" | "activeSuspension",
  position: number
}
```

### Parameters
- `joint` - the name of the joint
- `position` - the current position in degrees

## Set Arm IK Enabled
### Description
Sent from Mission Control to enable or disable inverse kinematics controls on the rover.

### Syntax
```
{
  type: "setArmIKEnabled",
  enabled: boolean
}
```

### Parameters
- `enabled` - whether or not inverse kinematics for the arm should be enabled or disabled.

## Motor Status Report
### Description
Sent from the rover server to inform Mission Control of a motor's status.

### Syntax
```
{
  type: "motorStatusReport",
  motor: string,
  power: number | null,
  position: number | null,
}
```

### Parameters
- `motor` - the name of the motor
- `power` - the current power of the motor, or `null` if unavailable
- `position` - the current position of the motor in degrees, or `null` if unavailable

## Rover Position Report
### Description
Sent from the rover to inform Mission Control of the rover's current position in the world reference frame

### Syntax
```
{
  type: "roverPositionReport",
  orientW: number,
  orientX: number,
  orientY: number,
  orientZ: number,
  lon: number,
  lat: number,
  recency: number
}
```
### Parameters
- `orientW` - refers to the orientation quaternion W component
- `orientX` - refers to the orientation quaternion X component
- `orientY` - refers to the orientation quaternion Y component
- `orientZ` - refers to the orientation quaternion Z component
- `lon` - refers to the longitude of the rover in world reference frame in degrees in floating point values
- `lat` - refers to the latitude of the rover in world reference frame in degrees in floating point values
- `recency` - refers to the difference in time between when the measurement was taken and sent in seconds

## Camera Stream Open Request
### Description
Sent from Mission Control to instruct the rover server to begin providing a camera stream.

### Syntax
```
{
  type: "cameraStreamOpenRequest",
  camera: string,
  fps: number
}
```

### Parameters
- `camera` - the name of the camera
- `fps` - the frame rate of the camera stream as an integer


## Camera Stream Close Request
### Description
Sent from Mission Control to instruct the rover server to stop providing a camera stream.

### Syntax
```
{
  type: "cameraStreamCloseRequest",
  camera: string
}
```

### Parameters
- `camera` - the name of the camera

## Camera Stream Report
### Description
Sent from the rover server to inform Mission Control of a single frame of a camera stream.

### Syntax
```
{
  type: "cameraStreamReport",
  camera: string,
  data: string | null
}
```

### Parameters
- `camera` - the name of the camera
- `data` - the raw h264 frame data, or `null` if no data is available


## Autonomous Waypoint Navigation Request
### Description
Sent from Mission Control to instruct the rover to navigate to the next waypoint. This message will only be sent if the rover is in autonomous mode.

### Syntax
```
{
  type: "waypointNavRequest",
  latitude: number,
  longitude: number,
  isApproximate: boolean,
  isGate: boolean
}
```

### Parameters
- `latitude` - the latitude of the waypoint in degrees
- `longitude` - the longitude of the waypoint in degrees
- `isApproximate` - denotes whether the location is an approximate location (See section 1.e.v [URC Rules](https://urc.marssociety.org/home/requirements-guidelines))
- `isGate` - denotes whether the location is a gate (two posts the rover must pass between)

## Autonomous Planned Path Report
### Description
Sent from the rover server to inform Mission Control of the currently planned autonomous path for plan visualization.

### Syntax
```
{
  type: "autonomousPlannedPathReport",
  path: { x: number, y: number, heading: number }[]
}
```

### Parameters
- `path` - an array of points in cartesian coordinates that make up the planned path, where points with adjacent indices are connected by an edge
- `x` - the x-coordinate of a point in meters relative to the rover's position, where positive means in front of the rover and negative means behind the rover
- `y` - the y-coordinate of a point in meters relative to the rover's position, where positive means left of the rover and negative means right of the rover
- `heading` - the planned heading of the rover at a point, measured in radians counterclockwise from the rover's x-axis

## Pose Confidence Report
### Description
Sent from the rover server to inform Mission Control of an ellipse representing the 95% confidence interval for the rover's true position. This ellipse will be displayed in the Plan Viz.

### Syntax
```
{
  type: "poseConfidenceReport",
  radiusX: number,
  radiusY: number,
  rotation: number
}
```

### Parameters
- `radiusX` - the radius of the ellipse along the rover's x-axis before the rotation is applied
- `radiusY` - the radius of the ellipse along the rover's y-axis before the rotation is applied
- `rotation` - how many radians counterclockwise the ellipse is rotated

## Lidar Data Report
### Description
Sent from the rover server to inform Mission Control of data provided by the rover's lidar sensor.

### Syntax
```
{
  type: "lidarReport",
  points: { x: number, y: number }[]
}
```

### Parameters
- `points` - an array of points in cartesian coordinates read by the lidar sensor
- `x` - the x-coordinate of a point in meters relative to the rover's position, where positive means in front of the rover and negative means behind the rover
- `y` - the y-coordinate of a point in meters relative to the rover's position, where positive means left of the rover and negative means right of the rover

<<<<<<< HEAD
=======
## Lazy Susan Position Request
### Description
Sent from Mission Control to instruct the rover server to rotate the lazy Susan to a specified position.

### Syntax
```
{
  type: "lazySusanPositionRequest",
  position: number
}
```

### Paremeters
- `position` - the requested integer position in [0, 5]

## Lazy Susan Lid Close Request
### Description
Sent from Mission Control to instruct the rover server to open or close the lids on the lazy Susan.

### Syntax
```
{
  type: "lazySusanLidCloseRequest",
  close: boolean
}
```

### Paremeters
- `close` - `true` to close the lids, `false` to open the lids

## Drill Request
### Description
Sent from Mission Control to instruct the rover server turn the science drill in a specified direction.

### Syntax
```
{
  type: "drillRequest",
  direction: -1 | 0 | 1
}
```

### Paremeters
- `direction` - `-1` to turn in reverse, `0` to stop, `1` to turn forward

## Syringe Dispense Request
### Description
Sent from Mission Control to instruct the rover server to dispense fluid from the science syringes.

### Syntax
```
{
  type: "syringeDispenseRequest",
  amount: number
}
```

### Parameters
- `amount` - the amount of fluid to dispense in [0.0, 1.0], where 0.0 corresponds to no fluid dispensed, and 1.0 corresponds to all of the fluid dispensed

>>>>>>> 0e7d273fc1b5c1c89648b9c9e88e5b4654b07094
## Log Entry Report
### Description
Sent from the rover server to inform Mission Control of a log entry to display in the logging panel.

### Syntax
```
{
  type: "logEntryReport",
  logLevel: "trace" | "debug" | "info" | "warn" | "error",
  message: string,
  timestamp: number
}
```

### Parameters
- `logLevel` - the log level of the entry
- `message` - the message contained in the entry
- `timestamp` - the epoch timestamp of the entry in milliseconds
