import React from 'react'
import Compass from '../navigation/Compass.js'
import './ArmDexterityPanel.css'
import {WaypointList} from '../navigation/WaypointList.js'
import {WaypointNav} from '../navigation/WaypointNav.js'
import {KeyboardTable} from '../help/KeyboardTable.js'
import {KeyboardDisplay} from '../help/KeyboardDisplay.js'
import {Gamepad} from '../help/Gamepad.js'
import {GamepadTable} from '../help/GamepadTable.js'
import {GamepadIndex, GamepadNames} from '../../constants/gamepadConstants.js'
import CamWrapper from '../camera/CamWrapper.js'
import type {Coordinate, ComponentName} from '../../constants/types.js'

export const ArmDexterityPanel = ({
  coordinateData,
  rowData,
  colData,
}: {
  coordinateData: Partial<Record<ComponentName, Coordinate[] | null>> | undefined
  rowData: number
  colData: number
}) => {
  return (
    <div
      className="arm-dexterity-panel"
      style={{
        display: 'grid',
        gridTemplateRows: `repeat(${rowData}, 1fr)`,
        gridTemplateColumns: `repeat(${colData}, 1fr)`,
      }}>
      {(coordinateData?.['cam'] ?? []).map((coord) => (
        <div
          key={coord.join(',')}
          style={{gridColumn: `${coord[1] + 1}`, gridRow: `${coord[0] + 1}`}}>
          <CamWrapper />
        </div>
      ))}
      {(coordinateData?.['compass'] ?? []).map((coord) => (
        <div
          key={coord.join(',')}
          style={{gridColumn: `${coord[1] + 1}`, gridRow: `${coord[0] + 1}`}}>
          <Compass />
        </div>
      ))}
      {(coordinateData?.['waypointlist'] ?? []).map((coord) => (
        <div
          key={coord.join(',')}
          style={{gridColumn: `${coord[1] + 1}`, gridRow: `${coord[0] + 1}`}}>
          <WaypointList />
        </div>
      ))}
      {(coordinateData?.['waypointnav'] ?? []).map((coord) => (
        <div
          key={coord.join(',')}
          style={{gridColumn: `${coord[1] + 1}`, gridRow: `${coord[0] + 1}`}}>
          <WaypointNav />
        </div>
      ))}
      {(coordinateData?.['driveGP'] ?? []).map((coord) => (
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
      {(coordinateData?.['peripheralGP'] ?? []).map((coord) => (
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

      {(coordinateData?.['keyboard'] ?? []).map((coord) => (
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
