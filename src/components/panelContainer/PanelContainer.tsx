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
import type {
  ComponentName,
  ComponentCoordinates,
  PanelKey,
  PanelCoordinates,
} from '../../constants/types.js'

function PanelContainer() {
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
  // Layouts holds the default num of rows/cols for each panel for layout customization
  // ex. layouts[navigation] = [2,3] means the navigation panel has 2 rows and 3 cols by default
  const layouts = {navigation: [2, 3], armDexterity: [1, 2]}
  // Coordinates holds the default configuration of each panel
  const [coordinates, setCoordinates] = useState<PanelCoordinates>({
    navigation: {
      cam: [
        [0, 0],
        [0, 1],
        [1, 0],
      ],
      compass: [[0, 2]],
      waypointlist: [[1, 1]],
      waypointnav: [[1, 2]],
      driveGP: null,
      peripheralGP: null,
      keyboard: null,
      '': null,
    },
    armDexterity: {
      cam: [
        [0, 0],
        [0, 1],
      ],
      compass: null,
      waypointlist: null,
      waypointnav: null,
      driveGP: null,
      peripheralGP: null,
      keyboard: null,
      '': null,
    }
  })

  const [rowNum, setRowNum] = useState({
    navigation: layouts.navigation[0],
    armDexterity: layouts.armDexterity[0],
  })
  const [colNum, setColNum] = useState({
    navigation: layouts.navigation[1],
    armDexterity: layouts.armDexterity[1],
  })
  const [editStatus, setEditStatus] = useState({
    navigation: false,
    armDexterity: false,
  })

  // Processes data from customization panel and updates states accordingly
  const handleChildData = (data: (ComponentName | null)[][], key: PanelKey) => {
    const processedData = processCustomizationPanelData(data)
    updateMapKey(key, processedData.coordinates, setCoordinates)
    updateRowColNum(key, processedData.rowNum, processedData.colNum, setRowNum, setColNum)
    setEditStatus((prev) => ({
      ...prev,
      [key]: false,
    }))
  }

  // Updates the coordinates for a specific panel key
  function updateMapKey(
    key: PanelKey,
    newValue: ComponentCoordinates,
    setCoordinates: React.Dispatch<React.SetStateAction<PanelCoordinates>>
  ) {
    setCoordinates((prev) => ({
      ...prev,
      [key]: newValue,
    }))
  }

  // Updates the number of rows and columns for a specific panel key
  function updateRowColNum(
    key: PanelKey,
    rowNum: number,
    colNum: number,
    setRowNum: React.Dispatch<React.SetStateAction<Record<PanelKey, number>>>,
    setColNum: React.Dispatch<React.SetStateAction<Record<PanelKey, number>>>
  ) {
    setRowNum((prev) => ({
      ...prev,
      [key]: rowNum,
    }))

    setColNum((prev) => ({
      ...prev,
      [key]: colNum,
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
              <NavigationPanel
                coordinateData={coordinates.navigation}
                rowData={rowNum.navigation}
                colData={colNum.navigation}
              />
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
                    prevCoordinates={coordinates.navigation}
                    numRowsP={rowNum.navigation}
                    numColsP={colNum.navigation}
                    onSend={(data) => handleChildData(data, 'navigation')}
                    components={components}
                    panelKey="navigation"
                    edit={editStatus.navigation}
                    defaultSettings={layouts.navigation}
                    setEdit={(edit) => setEditStatus({...editStatus, navigation: edit})}
                  />
                )}
              </div>
            </>
          }
        />
        <Route path="/arm-dexterity" element={<><ArmDexterityPanel coordinateData={coordinates.armDexterity}
                rowData={rowNum.armDexterity}
                colData={colNum.armDexterity}/>
                <div
                className="customization-container"
                style={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  zIndex: 1000,
                }}>
                {!editStatus.armDexterity && (
                  <button
                    onClick={() => setEditStatus({...editStatus, armDexterity: true})}
                    style={{position: 'absolute', bottom: 0, right: 0, zIndex: 999}}>
                    {' '}
                    Edit Layout
                  </button>
                )}
                {editStatus.armDexterity && (
                  <CustomizationPanel
                    prevCoordinates={coordinates.armDexterity}
                    numRowsP={rowNum.armDexterity}
                    numColsP={colNum.armDexterity}
                    onSend={(data) => handleChildData(data, 'armDexterity')}
                    components={components}
                    panelKey="armDexterity"
                    edit={editStatus.armDexterity}
                    defaultSettings={layouts.armDexterity}
                    setEdit={(edit) => setEditStatus({...editStatus, armDexterity: edit})}
                  />
                )}
              </div>

                </>} />

        <Route path="/telemetry" element={<TelemetryPanel />} />

        <Route path="/help" element={<HelpPanel />} />

        <Route path="/map" element={<MapPanel />} />
      </Routes>
    </div>
  )
}

export default PanelContainer
