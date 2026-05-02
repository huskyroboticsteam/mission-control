import CameraStream from '../camera/CameraStream'
import Compass from './Compass'
import './NavigationPanel.css'
import OpModeSelect from './OpModeSelect'
import WaypointList from './WaypointList'
import WaypointNav from './WaypointNav'
import {useState} from 'react'
import CustomizationPanel from '../armDexterity/CustomizationPanel'
import processCustomizationPanelData from '../../util/processCustomizationPanelData'

function NavigationPanel() {
  const defaultSettings = [2, 3]
  const components = ['mast', 'hand', 'compass', 'wrist', 'waypointlist', 'waypointnav']
  const [rowNum, setRowNum] = useState(defaultSettings[0])
  const [colNum, setColNum] = useState(defaultSettings[1])
  // holds corresponding coordinates for where each component should be
  const [coordinates, setCoordinates] = useState([
    [[0, 0]],
    [[0, 1]],
    [[0, 2]],
    [[1, 0]],
    [[1, 1]],
    [[1, 2]],
  ])
  const [edit, setEdit] = useState(false)

  const handleChildData = (data) => {
    const processedData = processCustomizationPanelData(data, components)
    setCoordinates(processedData.coordinates)
    setRowNum(processedData.rowNum)
    setColNum(processedData.colNum)
    setEdit(false)
  }

  return (
    <div
      className="navigation-panel"
      style={{
        display: 'grid',
        gridTemplateRows: `repeat(${rowNum}, 1fr)`,
        gridTemplateColumns: `repeat(${colNum}, 1fr)`,
      }}>
      {coordinates[0]?.length > 0 &&
        coordinates[0].map((coord) => (
          <div style={{gridColumn: `${coord[1] + 1}`, gridRow: `${coord[0] + 1}`}}>
            <CameraStream camera="mast" />
          </div>
        ))}
      {coordinates[1]?.length > 0 &&
        coordinates[1].map((coord) => (
          <div style={{gridColumn: `${coord[1] + 1}`, gridRow: `${coord[0] + 1}`}}>
            <CameraStream camera="hand" />
          </div>
        ))}
      {coordinates[2]?.length > 0 &&
        coordinates[2].map((coord) => (
          <div style={{gridColumn: `${coord[1] + 1}`, gridRow: `${coord[0] + 1}`}}>
            <Compass />
          </div>
        ))}
      {coordinates[3]?.length > 0 &&
        coordinates[3].map((coord) => (
          <div style={{gridColumn: `${coord[1] + 1}`, gridRow: `${coord[0] + 1}`}}>
            <CameraStream camera="wrist" />
          </div>
        ))}
      {coordinates[4]?.length > 0 &&
        coordinates[4].map((coord) => (
          <div style={{gridColumn: `${coord[1] + 1}`, gridRow: `${coord[0] + 1}`}}>
            <WaypointList />
          </div>
        ))}
      {coordinates[5]?.length > 0 &&
        coordinates[5].map((coord) => (
          <div style={{gridColumn: `${coord[1] + 1}`, gridRow: `${coord[0] + 1}`}}>
            <WaypointNav />
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

export default NavigationPanel
