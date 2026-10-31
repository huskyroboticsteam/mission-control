import React from 'react'
import CameraStream from '../camera/CameraStream.js'
import Compass from './Compass.js'
import './NavigationPanel.css'
import {WaypointList} from './WaypointList.js'
import {WaypointNav} from './WaypointNav.js'

import {useState} from 'react'
import CustomizationPanel from '../panelContainer/CustomizationPanel.js'
import {processCustomizationPanelData} from '../../util/processCustomizationPanelData.js'
import Keyboard from 'react-simple-keyboard'
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
export const NavigationPanel = ({coordinateData, rowData, colData}: {coordinateData: Record<ComponentName, Coordinate[] | null>, rowData: number, colData: number}) => {

  return (
    <div
      className="navigation-panel"
      style={{
        display: 'grid',
        gridTemplateRows: `repeat(${rowData}, 1fr)`,
        gridTemplateColumns: `repeat(${colData}, 1fr)`,
      }}>
      {coordinateData['cam']?.length > 0 &&
        coordinateData['cam'].map((coord) => (
          <div style={{gridColumn: `${coord[1] + 1}`, gridRow: `${coord[0] + 1}`}}>
            <CameraStream camera="mast" />
          </div>
        ))}
      {coordinateData['compass']?.length > 0 &&
        coordinateData['compass'].map((coord) => (
          <div style={{gridColumn: `${coord[1] + 1}`, gridRow: `${coord[0] + 1}`}}>
            <CameraStream camera="hand" />
            <Compass />
          </div>
        ))}
      {coordinateData['waypointlist']?.length > 0 &&
        coordinateData['waypointlist'].map((coord) => (
          <div style={{gridColumn: `${coord[1] + 1}`, gridRow: `${coord[0] + 1}`}}>
            <CameraStream camera="wrist" />
          </div>
        ))}
      {coordinateData['waypointlist']?.length > 0 &&
        coordinateData['waypointlist'].map((coord) => (
          <div style={{gridColumn: `${coord[1] + 1}`, gridRow: `${coord[0] + 1}`}}>
            <WaypointList />
          </div>
        ))}
      {coordinateData['waypointnav']?.length > 0 &&
        coordinateData['waypointnav'].map((coord) => (
          <div style={{gridColumn: `${coord[1] + 1}`, gridRow: `${coord[0] + 1}`}}>
            <WaypointNav />
          </div>
        ))}
      {coordinateData['peripheralGP']?.length > 0 &&
        coordinateData['peripheralGP'].map((coord) => (
          <div style={{gridColumn: `${coord[1] + 1}`, gridRow: `${coord[0] + 1}`}}>
            <PeripheralGP />
          </div>
        ))}
      {coordinateData['keyboard']?.length > 0 &&
        coordinateData['keyboard'].map((coord) => (
          <div style={{gridColumn: `${coord[1] + 1}`, gridRow: `${coord[0] + 1}`}}>
            <Keyboard />
          </div>
        ))}
    </div>
  )
}
