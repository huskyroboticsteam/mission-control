import React, {useState} from 'react'
import {CameraStream} from '../camera/CameraStream.js'
import CustomizationPanel from './CustomizationPanel.js'
import './ArmDexterityPanel.css'
import {processCustomizationPanelData} from '../../util/processCustomizationPanelData.js'

export const ArmDexterityPanel = () => {
  const defaultSettings = [1, 2]
  const components = ['handcam', 'wristcam']
  const [rowNum, setRowNum] = useState(defaultSettings[0])
  const [colNum, setColNum] = useState(defaultSettings[1])
  const [coordinates, setCoordinates] = useState([[[0, 0]], [[0, 1]], [[1, 0]]])
  const [edit, setEdit] = useState(false)

  const handleChildData = (data: (number | null)[][]) => {
    const processedData = processCustomizationPanelData(data, components)
    setCoordinates(processedData.coordinates)
    setRowNum(processedData.rowNum)
    setColNum(processedData.colNum)
    setEdit(false)
  }

  return (
    <div
      className="arm-dexterity-panel"
      style={{
        display: 'grid',
        gridTemplateRows: `repeat(${rowNum}, 1fr)`,
        gridTemplateColumns: `repeat(${colNum}, 1fr)`,
      }}>
      {coordinates[0]?.length > 0 &&
        coordinates[0].map((coord) => (
          <div style={{gridColumn: `${coord[1] + 1}`, gridRow: `${coord[0] + 1}`}}>
            <CameraStream key={`handcam-${coord[0]}-${coord[1]}`} camera="hand" />
          </div>
        ))}
      {coordinates[1]?.length > 0 &&
        coordinates[1].map((coord) => (
          <div style={{gridColumn: `${coord[1] + 1}`, gridRow: `${coord[0] + 1}`}}>
            <CameraStream key={`wristcam-${coord[0]}-${coord[1]}`} camera="wrist" />
          </div>
        ))}
      <div
        className="customization-container"
        style={{position: 'absolute', bottom: 0, right: 0, zIndex: 1000}}>
        <CustomizationPanel
          onSend={handleChildData}
          components={components}
          edit={edit}
          defaultSettings={defaultSettings}
        />
      </div>
      {!edit && (
        <button
          onClick={() => setEdit(true)}
          style={{position: 'absolute', bottom: 0, right: 0, zIndex: 999}}>
          {' '}
          Edit Layout
        </button>
      )}
    </div>
  )
}
