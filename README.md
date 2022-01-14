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

## Running Mission Control
1. Open your terminal in the `mission-control` directory.
2. Run `npm start` to start the React server. Mission Control will open in your web browser shortly.

## Controls
The rover can be operated through Mission Control with either a keyboard or two gamepads. The first gamepad provides controls for driving the rover. The second gamepad provides controls for operating the rover's arm. The control bindings are detailed below.
![Drive gamepad controls](/src/components/help/driveGamepadControls.png)
![Arm gamepad controls](/src/components/help/armGamepadControls.png)
![Keyboard controls](/src/components/help/keyboardControls.png)

## Messages
The JSON objects sent between Mission Control and the rover server are termed *messages*. Each message has a type property and a number of additional parameters depending on the type. The usage of each type of message is detailed below.

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
- `straight` - straight component in [-1, 1], where positive means drive forward and negative means drive backward
- `steer` - steer component in [-1, 1], where positive means steer right and negative means steer left

## Motor Power Request
### Description
Sent from Mission Control to instruct the rover server to make a motor run with a specified power.

### Syntax
```
{
  type: "motorPowerRequest",
  motor: string,
  power: number
}
```

### Parameters
- `motor` - the name of the motor
- `power` - the requested power in [-1, 1]

## Motor Position Request
### Description
Sent from Mission Control to instruct the rover server to make a motor run to a specified position.

### Syntax
```
{
  type: "motorPositionRequest",
  motor: string,
  position: number
}
```

### Parameters
- `motor` - the name of the motor
- `position` - the requested position in degrees

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
  velocity: number | null
}
```

### Parameters
- `motor` - the name of the motor
- `power` - the current power of the motor, or `null` if unavailable
- `position` - the current position of the motor in degrees, or `null` if unavailable
- `velocity` - the current velocity of the motor in degrees per second, or `null` if unavailable

## Camera Stream Open Request
### Description
Sent from Mission Control to instruct the rover server to begin providing a camera stream.

### Syntax
```
{
  type: "cameraStreamOpenRequest",
  camera: string,
  fps: number,
  width: number,
  height: number
}
```

### Parameters
- `camera` - the name of the camera
- `fps` - the frames per second of the stream
- `width` - the width of the stream in pixels
- `height` - the height of the stream in pixels

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
- `data` - the frame in JPG format encoded as a base-64 string, or `null` if no data is available

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
