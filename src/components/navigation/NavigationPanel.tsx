import React from 'react'
import CameraStream from '../camera/CameraStream.js'
import Compass from './Compass.js'
import './NavigationPanel.css'
import {WaypointList} from './WaypointList.js'
import {WaypointNav} from './WaypointNav.js'
import {KeyboardTable} from '../help/KeyboardTable.js'
import {KeyboardDisplay} from '../help/KeyboardDisplay.js'
import {Gamepad} from '../help/Gamepad.js'
import {GamepadTable} from '../help/GamepadTable.js'
import {GamepadIndex, GamepadNames} from '../../constants/gamepadConstants.js'
import CamWrapper from '../camera/CamWrapper.js'

type Coordinate = [number, number]
type ComponentName =
  | 'cam'
  | 'compass'
  | 'waypointlist'
  | 'waypointnav'
  | 'driveGP'
  | 'peripheralGP'
  | 'keyboard'
  | ''
type ComponentCoordinates = Record<ComponentName, Coordinate[] | null>
type PanelKey = 'navigation' | 'armDexterity' | 'help'
type PanelCoordinates = Record<PanelKey, ComponentCoordinates>

const components: ComponentName[] = [
  'cam',
  'compass',
  'waypointlist',
  'waypointnav',
  'driveGP',
  'peripheralGP',
  'keyboard',
  '',
]
export const NavigationPanel = ({
  coordinateData,
  rowData,
  colData,
}: {
  coordinateData: Record<ComponentName, Coordinate[] | null>
  rowData: number
  colData: number
}) => {
  return (
    <div
      className="navigation-panel"
      style={{
        display: 'grid',
        gridTemplateRows: `repeat(${rowData}, 1fr)`,
        gridTemplateColumns: `repeat(${colData}, 1fr)`,
      }}>
      {(coordinateData['cam'] ?? []).map((coord) => (
        <div
          key={coord.join(',')}
          style={{gridColumn: `${coord[1] + 1}`, gridRow: `${coord[0] + 1}`}}>
          <CamWrapper />
        </div>
      ))}
      {(coordinateData['compass'] ?? []).map((coord) => (
        <div
          key={coord.join(',')}
          style={{gridColumn: `${coord[1] + 1}`, gridRow: `${coord[0] + 1}`}}>
          <Compass />
        </div>
      ))}
      {(coordinateData['waypointlist'] ?? []).map((coord) => (
        <div
          key={coord.join(',')}
          style={{gridColumn: `${coord[1] + 1}`, gridRow: `${coord[0] + 1}`}}>
          <WaypointList />
        </div>
      ))}
      {(coordinateData['waypointnav'] ?? []).map((coord) => (
        <div
          key={coord.join(',')}
          style={{gridColumn: `${coord[1] + 1}`, gridRow: `${coord[0] + 1}`}}>
          <WaypointNav />
        </div>
      ))}
      {(coordinateData['driveGP'] ?? []).map((coord) => (
        <div
          key={coord.join(',')}
          style={{gridColumn: `${coord[1] + 1}`, gridRow: `${coord[0] + 1}`}}>
          <div
            className="drive-gpad"
            style={{
              gridColumn: `${coord[1] + 1}`,
              gridRow: `${coord[0] + 1}`,
            }}>
            <GamepadTable gamepadName={GamepadNames.driveGamepad} />
            <div className="g1-text-wrapper">
              <b className="label">Driver Gamepad</b>
              <Gamepad index={GamepadIndex.driveGamepad} />
            </div>
          </div>
        </div>
      ))}
      {(coordinateData['peripheralGP'] ?? []).map((coord) => (
        <div
          key={coord.join(',')}
          style={{gridColumn: `${coord[1] + 1}`, gridRow: `${coord[0] + 1}`}}>
          <div
            className="peripheral-gpad"
            style={{
              gridColumn: `${coord[1] + 1}`,
              gridRow: `${coord[0] + 1}`,
            }}>
            <GamepadTable gamepadName={GamepadNames.peripheralGamepad} />
            <div className="g2-text-wrapper">
              <b className="label">Peripheral Gamepad</b>
              <Gamepad index={GamepadIndex.peripheralGamepad} />
            </div>
          </div>
        </div>
      ))}

      {(coordinateData['keyboard'] ?? []).map((coord) => (
        <div
          key={coord.join(',')}
          style={{gridColumn: `${coord[1] + 1}`, gridRow: `${coord[0] + 1}`}}>
          <div
            className="keyboard-container"
            style={{
              gridColumn: `${coord[1] + 1}/-1`,
              gridRow: `${coord[0] + 1}`,
              alignSelf: 'center',
            }}>
            <KeyboardTable />
            <div className="keyboard">
              <b className="label">Keyboard Controls</b>
              <KeyboardDisplay />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
