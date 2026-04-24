import RoverModel from '../roverModel/RoverModel'
import CameraStream from '../camera/CameraStream'
import CustomizationPanel from './CustomizationPanel'
import {useState, useEffect, memo} from 'react'
import './ArmDexterityPanel.css'

function ArmDexterityPanel() {
  const components = ['handcam', 'wristcam', 'rovermodel']
  const [rowNum, setRowNum] = useState(1)
  const [colNum, setColNum] = useState(3)
  // holds corresponding coordinates for where each component should be
  const [coordinates, setCoordinates] = useState([null, null, null])
  const[edit, setEdit] = useState(false);

  const handleChildData = (data) => {
    let temparr = [null, null, null]
    setRowNum(data.length)
    setColNum(data[0].length)
    for (let i = 0; i < data.length; i++) {
      for (let j = 0; j < data[i].length; j++) {
        if (data[i][j] !== -1) {
          console.log(components[data[i][j]], i, j)
          temparr[data[i][j]] = temparr[data[i][j]] || []
          temparr[data[i][j]].push([i, j])
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
        gridTemplateRows: `repeat(${rowNum - 1}, 1fr)`,
        gridTemplateColumns: `repeat(${colNum}, 1fr)`,
      }}>
      {coordinates[0]?.length > 0 && (
        <CameraStream
          camera="hand"
          style={{gridColumn: `{coordinates[0][1]}`, gridRow: `{coordinates[0][0]}`}}
        />
      )}
      {coordinates[1]?.length > 0 && (
        <CameraStream
          camera="wrist"
          style={{gridColumn: `{coordinates[1][1]}`, gridRow: `{coordinates[1][0]}`}}
        />
      )}
      {coordinates[2]?.length > 0 && (
        <RoverModel style={{gridColumn: `{coordinates[2][1]}`, gridRow: `{coordinates[2][0]}`}} />
      )}
      <div className = "customization-container">
      
        <CustomizationPanel onSend={handleChildData} components={components} edit = {edit}/>
      
      </div>
      <button onClick={() => setEdit(true)} style={{position: 'absolute', top: 300, left: 300, zIndex: 1000, color: 'black'}}> Edit Layout</button>
    </div>
  )
}

export default ArmDexterityPanel
