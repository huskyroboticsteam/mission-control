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
      
      {coordinates[0]?.length > 0 && coordinates[0].map((coord) => (
        <CameraStream
          camera="hand"
          style={{gridColumn: `${coord[1] + 1}`, gridRow: `${coord[0] + 1}`}}
        />
      ))} 
      {coordinates[1]?.length > 0 && coordinates[1].map((coord) => (
        <CameraStream
          camera="wrist"
          style={{gridColumn: `${coord[1] + 1}`, gridRow: `${coord[0] + 1}`}}
        />
      ))} 
      {coordinates[2]?.length > 0 && coordinates[2].map((coord) => (
        <RoverModel style={{gridColumn: `${coord[1] + 1}`, gridRow: `${coord[0] + 1}`}} />
      ))}
      <div className = "customization-container">
      
        <CustomizationPanel onSend={handleChildData} components={components} edit = {edit}/>
      
      </div>
      <button onClick={() => setEdit(true)} style={{position: 'absolute', top: 300, left: 300, zIndex: 1000, color: 'black'}}> Edit Layout</button>
    </div>
  )
}

export default ArmDexterityPanel
