import type {CameraNames} from './cameraConstants.js'
import type {JointNames} from './jointConstants.js'
import type {ServoNames} from './servoConstants.js'
import type {OpMode, Peripheral} from './types.js'

export type CameraFrameReportMessage = {
  type: 'cameraFrameReport'
  camera: keyof typeof CameraNames
  data: string
  lat: number
  lon: number
  alt: number
  orientX: number
  orientY: number
  orientZ: number
  orientW: number
}

export type CameraFrameRequestMessage = {
  type: 'cameraFrameRequest'
  camera: keyof typeof CameraNames
}

export type CameraStreamCloseRequestMessage = {
  type: 'cameraStreamCloseRequest'
  camera: keyof typeof CameraNames
}

export type CameraStreamOpenRequestMessage = {
  type: 'cameraStreamOpenRequest'
  camera: keyof typeof CameraNames
  fps: number
}

export type CameraStreamReportMessage = {
  type: 'cameraStreamReport'
  camera: keyof typeof CameraNames
  data: number[][] | null
}

export type DriveRequestMessage = {
  type: 'driveRequest'
  straight: number
  steer: number
}

export type TankDriveRequestMessage = {
  type: 'tankDriveRequest'
  left: number
  right: number
}

export type EmergencyStopRequestMessage = {
  type: 'emergencyStopRequest'
  stop: boolean
}

export type JointPositionReportMessage = {
  type: 'jointPositionReport'
  joint: keyof typeof JointNames
  position: number
}

export type JointPositionRequestMessage = {
  type: 'jointPositionRequest'
  joint: keyof typeof JointNames
  position: number
}

export type JointPowerRequestMessage = {
  type: 'jointPowerRequest'
  joint: keyof typeof JointNames
  power: number
}

export type OperationModeRequestMessage = {
  type: 'operationModeRequest'
  mode: OpMode
}

export type MountedPeripheralReportMessage = {
  type: 'mountedPeripheralReport'
  peripheral: Peripheral
}

export type ServoPositionReportMessage = {
  type: 'servoPositionReport'
  servo: keyof typeof ServoNames
  position: number
}

export type ServoPositionRequestMessage = {
  type: 'servoPositionRequest'
  servo: keyof typeof ServoNames
  position: number
}

export type RoverPositionReportMessage = {
  type: 'roverPositionReport'
  orientW: number
  orientX: number
  orientY: number
  orientZ: number
  lon: number
  lat: number
  alt: number
  recency: number
}

export type WaypointNavRequestMessage = {
  type: 'waypointNavRequest'
  latitude: number
  longitude: number
  isApproximate: boolean
  isGate: boolean
}

export type RequestMessage =
  | CameraFrameRequestMessage
  | CameraStreamCloseRequestMessage
  | CameraStreamOpenRequestMessage
  | DriveRequestMessage
  | TankDriveRequestMessage
  | EmergencyStopRequestMessage
  | JointPositionRequestMessage
  | JointPowerRequestMessage
  | OperationModeRequestMessage
  | ServoPositionRequestMessage
  | WaypointNavRequestMessage

export type ReportMessage =
  | CameraFrameReportMessage
  | CameraStreamReportMessage
  | JointPositionReportMessage
  | MountedPeripheralReportMessage
  | ServoPositionReportMessage
  | RoverPositionReportMessage
