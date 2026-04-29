import RoverModel from '../roverModel/RoverModel'
import CameraStream from '../camera/CameraStream'
import CustomizationPanel from './CustomizationPanel'
import {useState, useEffect, memo} from 'react'
import './ArmDexterityPanel.css'

function ArmDexterityPanel() {
  const components = ['handcam', 'wristcam', 'rovermodel']
  const [rowNum, setRowNum] = useState(2)
  const [colNum, setColNum] = useState(2)
  // holds corresponding coordinates for where each component should be
  const [coordinates, setCoordinates] = useState([
    [[0, 0]],
    [[0, 1]],
    [[1, 0]]
  ])
  const [edit, setEdit] = useState(false)

  const handleChildData = (data) => {
    const temparr = Array.from({length: 3}, () => [])
    setRowNum(data.length)
    setColNum(data[0].length)

    for (let i = 0; i < data.length; i++) {
      for (let j = 0; j < data[i].length; j++) {
        const key = data[i][j]

        if (key !== -1 && key != null) {
          temparr[key].push([i, j])
        }
      }
    }
    setCoordinates(temparr)
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
      {coordinates[2]?.length > 0 &&
        coordinates[2].map((coord) => (
          <div style={{gridColumn: `${coord[1] + 1}`, gridRow: `${coord[0] + 1}`}}>
            <RoverModel key={`rovermodel-${coord[0]}-${coord[1]}`} />
          </div>
        ))}
      <div className="customization-container">
        <CustomizationPanel
          onSend={handleChildData}
          components={components}
          edit={edit}
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

export default ArmDexterityPanel
