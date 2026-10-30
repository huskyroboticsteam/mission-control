import {Routes, Route, Navigate} from 'react-router-dom'
import {TelemetryPanel} from '../telemetry/TelemetryPanel.js'
import {HelpPanel} from '../help/HelpPanel.js'
import {NavigationPanel} from '../navigation/NavigationPanel.js'
import {ArmDexterityPanel} from '../armDexterity/ArmDexterityPanel.js'
import {MapPanel} from '../map/MapPanel.js'
import CustomizationPanel from '../panelContainer/CustomizationPanel.js'
import './PanelContainer.css'
import React from 'react'
import {processCustomizationPanelData} from '../../util/processCustomizationPanelData.js'
import {useState} from 'react'

function PanelContainer() {
  type Coordinate = [number, number]
  type ComponentName =
    | 'cam'
    | 'compass'
    | 'gps'
    | 'waypointlist'
    | 'waypointnav'
    | 'driveGP'
    | 'peripheralGP'
    | 'keyboard'
  type ComponentCoordinates = Record<ComponentName, Coordinate[] | null>
  type PanelKey = 'navigation' | 'armDexterity' | 'help'
  type PanelCoordinates = Record<PanelKey, ComponentCoordinates>

  const components = [
    'cam',
    'compass',
    'gps',
    'waypointlist',
    'waypointnav',
    'driveGP',
    'peripheralGP',
    'keyboard',
  ]
  // layouts holds the default num of rows/cols for each panel for layout customization
  // ex. layouts[navigation] = [2,3] means the navigation panel has 2 rows and 3 cols by default
  const [layouts, setLayouts] = useState({navigation: [2, 3], armDexterity: [1, 2], help: [2, 2]})
  const [coordinates, setCoordinates] = useState({
    navigation: {
      cam: [
        [0, 0],
        [0, 1],
        [1, 0],
      ],
      compass: [
        [0, 2],
        [1, 2],
      ],
      gps: [
        [0, 0],
        [0, 1],
        [1, 0],
      ],
      waypointlist: [
        [0, 0],
        [0, 1],
        [1, 0],
      ],
      waypointnav: [
        [0, 0],
        [0, 1],
        [1, 0],
      ],
      driveGP: null,
      peripheralGP: null,
      keyboard: null,
    },
    armDexterity: {
      cam: [
        [0, 0],
        [0, 1],
        [1, 0],
      ],
      compass: [
        [0, 2],
        [1, 2],
      ],
      gps: [
        [0, 0],
        [0, 1],
        [1, 0],
      ],
      waypointlist: [
        [0, 0],
        [0, 1],
        [1, 0],
      ],
      waypointnav: [
        [0, 0],
        [0, 1],
        [1, 0],
      ],
      driveGP: null,
      peripheralGP: null,
      keyboard: null,
    },
    help: {
      cam: null,
      compass: null,
      gps: null,
      waypointlist: null,
      waypointnav: null,
      driveGP: [[0, 0]],
      peripheralGP: [[0, 1]],
      keyboard: [[1, 0]],
    },
  })

  const [rowNum, setRowNum] = useState({
    navigation: layouts.navigation[0],
    armDexterity: layouts.armDexterity[0],
    help: layouts.help[0],
  })
  const [colNum, setColNum] = useState({
    navigation: layouts.navigation[1],
    armDexterity: layouts.armDexterity[1],
    help: layouts.help[1],
  })
  const [editStatus, setEditStatus] = useState({
    navigation: false,
    armDexterity: false,
    help: false,
  })
  type mapValue = [number, number] | number | boolean | Map<string, [[number, number]] | null>
  const handleChildData = (data: (number | null)[][], key: PanelKey) => {
    const processedData = processCustomizationPanelData(data, components, key)
    //updateMapKey(key, processedData.coordinates, setCoordinates);
    //setRowNum(processedData.rowNum)
    //setColNum(processedData.colNum)
    setEditStatus((prev) => ({
      ...prev,
      [key]: false,
    }))
    console.log('Processed Data:', processedData)
  }

  const updateMapKey = (
    key: PanelKey,
    newValue: ComponentCoordinates,
    setCoordinates: React.Dispatch<React.SetStateAction<PanelCoordinates>>
  ) => {
    setCoordinates((prev) => ({
      ...prev,
      [key]: newValue,
    }))
  }
  return (
    <div className="panel-container">
      <Routes>
        <Route path="/" element={<Navigate to="/navigation" />} />
        <Route
          path="/navigation"
          element={
            <>
              <NavigationPanel />
              <div
                className="customization-container"
                style={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  zIndex: 1000,
                }}>
                {!editStatus.navigation && (
                  <button
                    onClick={() => setEditStatus({...editStatus, navigation: true})}
                    style={{position: 'absolute', bottom: 0, right: 0, zIndex: 999}}>
                    {' '}
                    Edit Layout
                  </button>
                )}
                {editStatus.navigation && (
                  <CustomizationPanel
                    onSend={(data) => handleChildData(data, 'navigation')}
                    components={components}
                    panelKey="navigation"
                    edit={editStatus.navigation}
                    defaultSettings={layouts.navigation}
                  />
                )}
              </div>
            </>
          }
        />
        <Route path="/arm-dexterity" element={<ArmDexterityPanel />} />

        <Route path="/telemetry" element={<TelemetryPanel />} />

        <Route path="/help" element={<HelpPanel />} />

        <Route path="/map" element={<MapPanel />} />
      </Routes>
    </div>
  )
}

export default PanelContainer
