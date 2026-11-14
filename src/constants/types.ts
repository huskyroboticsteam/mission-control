// Collection of miscellaneous types
export type OpMode = 'teleoperation' | 'autonomous'
export type Peripheral = 'arm' | 'science' | 'none' | null
export type DriveMode = 'normal' | 'tank'
// Types for panel container customization
export type Coordinate = [number, number]
export type ComponentName =
  | 'cam'
  | 'compass'
  | 'waypointlist'
  | 'waypointnav'
  | 'driveGP'
  | 'peripheralGP'
  | 'keyboard'
  | ''
export type ComponentCoordinates = Partial<Record<ComponentName, Coordinate[] | null>>
export type PanelKey = 'navigation' | 'armDexterity'
export type PanelCoordinates = Partial<Record<PanelKey, ComponentCoordinates>>
