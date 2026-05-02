import JointTelemetry from './JointTelemetry'
import InputTelemetry from './InputTelemetry'
import './TelemetryPanel.css'
import CustomizationPanel from '../armDexterity/CustomizationPanel'
import processCustomizationPanelData from '../../util/processCustomizationPanelData'
import {useState} from 'react'

function TelemetryPanel() {
  // for customization panel
  const defaultSettings = [1, 2]
    const components = ['inputTel', 'jointTel']
    const [rowNum, setRowNum] = useState(defaultSettings[0])
    const [colNum, setColNum] = useState(defaultSettings[1])
    const [coordinates, setCoordinates] = useState([[[0, 0]], [[0, 1]]])
    const [edit, setEdit] = useState(false)
  
    const handleChildData = (data) => {
      const processedData = processCustomizationPanelData(data, components)
      setCoordinates(processedData.coordinates)
      setRowNum(processedData.rowNum)
      setColNum(processedData.colNum)
      setEdit(false)
    }
  return (
    <div className="telemetry-panel" style={{
        display: 'grid',
        gridTemplateRows: `repeat(${rowNum}, 1fr)`,
        gridTemplateColumns: `repeat(${colNum}, 1fr)`,
      }}>
      {coordinates[0]?.length > 0 &&
        coordinates[0].map((coord) => (
          <div style={{gridColumn: `${coord[1] + 1}`, gridRow: `${coord[0] + 1}`}}>
            <InputTelemetry />
          </div>
        ))}
      {coordinates[1]?.length > 0 &&
        coordinates[1].map((coord) => (
          <div style={{gridColumn: `${coord[1] + 1}`, gridRow: `${coord[0] + 1}`}}>
            <JointTelemetry />
          </div>
        ))}
      <div className="customization-container">
              <CustomizationPanel
                onSend={handleChildData}
                components={components}
                edit={edit}
                defaultSettings={defaultSettings}
                style={{position: 'absolute', bottom: 0, right: 0, zIndex: 1000}}
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

export default TelemetryPanel
