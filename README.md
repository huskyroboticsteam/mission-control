# Mission Control
The user interface for remotely operating the Husky Robotics rover.

## Overview
Mission Control creates a WebSocket client to connect directly to the rover WebSocket server at the URL `ws://localhost:3001/mission-control`. Mission Control will automatically connect to the rover server and reconnect as needed, providing a visual indication of the connection status. Mission Control and the rover server communicate with each other by sending JSON objects termed *messages* over the WebSocket connection. Through these messages, Mission Control can request that the rover perform certain actions, such as drive with a specified velocity. Additionally, the rover server provides Mission Control with data such as camera streams and motor positions through these messages.

## Versioning
The Version of Node and NPM we are using is version 20 (latest tested version is 20.9.0)

If any build or runtime errors appear (eg. a new major version of a package comes out), *TELL SOMEONE* so we can address it.

## Setup
1. Install Node.js. You will need version 20 (The Long-Term Support (LTS) version)
    - **Windows and macOS**: Download and run [the installer](https://nodejs.org/en/download/) for Node.js v20.x.x on your operating system
    (don't use the binary!)
    - **Linux**: Run the following commands in the terminal:
    1. `sudo apt-get update` (updates package list)
    2. `sudo apt-get install -y ca-certificates curl gnupg` (install neccessary packages)
    3. `sudo mkdir -p /etc/apt/keyrings` (makes a directory for the keyring)
    4. `curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | sudo gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg` (gets and imports the neccesary GPG key)
    5. `echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_20.x nodistro main" | sudo tee /etc/apt/sources.list.d/nodesource.list` (writes system information for the Node.js instalation)
    6. `sudo apt-get update` (one last update)
    7. `sudo apt-get install nodejs -y` (finally installs Node.js)
2. Run `git clone https://github.com/huskyroboticsteam/mission-control.git` in your terminal to clone the Mission Control repository to your local storage.
3. Run `cd mission-control` to navigate into the repository.
4. Run `npm install` to install dependencies.

### Browser
You should install and use Chromium for optimal video streaming performance. It has been tested to work on version 123. Run `sudo apt install chromium` to install Chromium.

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

## Messages (`v2025.1.0`)
The JSON objects sent between Mission Control and the rover server are termed *messages*. Each message has a type property and a number of additional parameters depending on the type. The usage of each type of message is detailed below.

## Mounted Peripheral Report
### Description
Sent from the rover server to inform Mission Control of the peripheral currently mounted on the rover. This should be sent any time the rover server connects with Mission Control.

### Syntax
```
{
  type: "mountedPeripheralReport",
  peripheral: "arm" | "science" | null
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

## Joint Power Request
### Description
Sent from Mission Control to instruct the rover server to make a joint move with a specified power.

### Syntax
```
{
  type: "jointPowerRequest",
  joint: string,
  power: number
}
```

### Parameters
- `joint` - the name of the joint
- `power` - the requested power in [-1.0, 1.0]

## Joint Position Request
### Description
Sent from Mission Control to instruct the rover server to make a joint move to a specified position.

### Syntax
```
{
  type: "jointPositionRequest",
  joint: string,
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
  joint: string,
  position: number
}
```

### Parameters
- `joint` - the name of the joint
- `position` - the current position in degrees

## Arm IK Request
### Description
Sent from Mission Control to instruct the rover to enable or disable inverse kinematics.  This packet is not guaranteed to enable/disable IK. An `armIKEnabledReport` packet will be sent immediately after the `armIKRequest` is processed by the rover, and this can be used to know if IK was successfully enabled/disabled. 

### Syntax
```
{
  type: "armIKRequest",
  enabled: boolean
}
```

### Parameters
- `enabled` - whether or not inverse kinematics for the arm should be enabled or disabled.

## Arm IK Enabled Report
### Description
Sent from the rover to inform Mission Control whether or not the Rover has enabled or disabled inverse kinematics.

### Syntax
```
{
  type: "armIKEnabledReport",
  enabled: boolean
}
```

### Parameters
- `enabled` - whether or not inverse kinematics for the arm is enabled

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
  alt: number,
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
- `alt` - refers to the altitude of the rover in meters relative to mean sea level
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

## Camera Frame Request
### Description
Sent from Mission Control to instruct the rover server to send a Camera Frame Report. If `camera` specifies a valid camera stream, the rover will respond with a Camera Frame Report containing the latest frame from that camera.

### Syntax
```
{
  type: "cameraFrameRequest",
  camera: string
}
```

### Parameters
- `camera` - the name of the camera

## Camera Frame Report
### Description
Sent from the rover server to inform Mission Control of a full resolution lossless camera frame.

### Syntax
```
{
  type: "cameraFrameReport",
  camera: string,
  data: string
}
```

### Parameters
- `camera` - the name of the camera
- `data` - the image, base64 encoded


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