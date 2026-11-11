import React, {useState, useEffect} from 'react'
import {getItem, setItem} from '../../util/localStorage.js'
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

type CustomizationPanelProps = {
  prevCoordinates: Record<ComponentName, Coordinate[] | null>
  components: ComponentName[]
  panelKey: PanelKey
  numRowsP: number
  numColsP: number
  onSend: (data: (ComponentName | null)[][], key: PanelKey) => void
  edit: boolean
  defaultSettings: number[] // [defaultNumRows, defaultNumCols]
  setEdit: (edit: boolean) => void
}

function convertComponentToCoordMap(
  prevCoordinates: Record<ComponentName, Coordinate[] | null>,
  numRows: number,
  numCols: number
): Array<Array<ComponentName>> {
  const rows = numRows // adjust to your grid size
  const cols = numCols

  const arr: Array<Array<ComponentName>> = Array.from({length: rows}, () =>
    Array(cols).fill('' as ComponentName)
  )

  Object.entries(prevCoordinates).forEach(([component, coordinates]) => {
    coordinates?.forEach(([row, col]) => {
      if (!arr[row]) {
        arr[row] = Array(cols).fill('' as ComponentName)
      }
      arr[row][col] = component as ComponentName
    })
  })

  return arr
}

function putInArray(row: number, col: number, arr: ComponentName[][], toPut: ComponentName) {
  const arrCopy = arr.map((row) => [...row])
  arrCopy[row][col] = toPut
  return arrCopy
}

// helper function to manage the array (representing the grid) state
function resize2DArray(rows: number, cols: number, arr: ComponentName[][]) {
  const arrCopy = arr.map((row) => [...row])
  // Case 1: row is less than current array row length - slice extra rows off
  if (rows < arr.length) {
    arrCopy.splice(rows, arr.length - rows)
  }
  // Case 2: row is greater than current array row length - add new rows to end (remains empty)
  else if (rows > arr.length) {
    for (let i = arrCopy.length; i < rows; i++) {
      arrCopy.push(Array(cols).fill(''))
    }
  }
  // Case 3: col is less than current array col length - slice extra cols off
  if (arr.length != 0 && cols < arr[0].length) {
    for (let i = 0; i < arrCopy.length; i++) {
      arrCopy[i].splice(cols, arrCopy[i].length - cols)
    }
  }
  // Case 4: col is greater than current array col length - add new cols to end (remains empty)
  else if (arr.length != 0 && cols > arrCopy[0].length) {
    for (let i = 0; i < arrCopy.length; i++) {
      for (let j = arrCopy[i].length; j < cols; j++) {
        arrCopy[i].push('')
      }
    }
  }
  // Case 5/6: row/col equal to current array row/col length - do nothing
  return arrCopy
}

// sends array of coordinates back to parent component, will be same indexing as passed components array and
// have value of -1 if not selected, else will be coordinate in grid where component should be placed
function CustomizationPanel({
  prevCoordinates,
  components,
  panelKey,
  numRowsP,
  numColsP,
  edit,
  onSend,
  setEdit,
}: CustomizationPanelProps) {
  const [numRows, setNumRows] = useState(numRowsP)
  const [numCols, setNumCols] = useState(numColsP)
  const [arr, setArr] = useState<Array<Array<ComponentName>>>(
    convertComponentToCoordMap(prevCoordinates, numRows, numCols)
  ) // grid array
  const [componentSelect, setComponentSelect] = useState<JSX.Element[]>([]) // array of component options
  const [currLayoutName, setCurrLayoutName] = useState<string | null>(null)
  const [savedLayoutNames, setSavedLayoutNames] = useState<string[]>(getSavedLayoutNames(panelKey))
  const [selectedSavedLayout, setSelectedSavedLayout] = useState('')
  

  // sets up component options
  useEffect(() => {
    const selectOptions = components.map((component, index) => (
      <option value={component} key={index}>
        {component}
      </option>
    ))
    setComponentSelect(selectOptions)
  }, [])

  // updates grid array when number of columns or rows changes
  useEffect(() => {
    setArr((prev) => resize2DArray(numRows, numCols, prev))
  }, [numCols, numRows])

// Convert layout to string
// layout structure: first line is numRows, numCols
//                   remaining lines are formatted like coordinate : component 
//                   new line for each coord mapping
  function convertToString(layoutToSave : Array<Array<ComponentName>> ) : string {
    let s = layoutToSave.length + "," + layoutToSave[0].length + "\n";
    for (let i = 0; i < layoutToSave.length; i++) {
      for (let j = 0; j < layoutToSave[i].length; j++) {
        if (layoutToSave[i][j] !== "") {
          s += i +"," + j + ":" + layoutToSave[i][j]
          s += "\n"
        }
      }
      
    }
    return s
  }

  function getSavedLayoutNames(key: string) {
    const keys = Object.keys(localStorage).filter((k) => k.startsWith(key)).map((k) => k.split(": ")[1]) // grabs only name not associated key
    return keys
  }

  // convert string to layout (2d array map of components)
  function convertStringToLayout(layoutString : string) : Array<Array<ComponentName>> {
    const lines = layoutString.split("\n")
    const [numRows, numCols] = lines[0].split(",").map(Number)
    const layout: ComponentName[][] = Array.from({ length: numRows }, () => 
  Array.from({ length: numCols }, () => "")
    );

    for (let i = 1; i < lines.length; i++) {
      const [coords, component] = lines[i].split(":")
      const [row, col] = coords.split(",").map(Number)
      if (!(row === undefined || col === undefined || component === undefined)) {
       layout[row][col] = component as ComponentName
      }
    }
    return layout
  }

  function saveLayout(layoutToSave: Array<Array<ComponentName>>, name: string | null, key: string) {
    const saveName = name ?? "unnamed"
    const layoutString = convertToString(layoutToSave)
    // update saved layout names list
    if (!savedLayoutNames.includes(saveName)) {
      setSavedLayoutNames((prev) => [...prev, saveName]);
    }
    if (name != null) {
      name = key + ": "  + name
      
    } else {
      name = key + ": unnamed"
    }
    setItem(name, layoutString)
    setCurrLayoutName(null)
  }

  function chooseThisLayout(layoutName: string, key: string){
    const str = localStorage.getItem(key + ": " + layoutName)
    if (str != null){
      const layout = convertStringToLayout(str)
      setArr(layout)
      setNumRows(layout.length)
      setNumCols(layout[0].length)
    }
  }

  return (
    <div
      style={{
        display: edit ? 'flex' : 'none',
        flexDirection: 'column',
        gap: '5px',
        position: 'absolute',
        right: '0',
        bottom: '0',
        zIndex: 1000,
        backgroundColor: 'white',
        color: 'black',
      }}>
        <div style = {{margin: '5px'}}>
          <h1>Customization Panel</h1>
      <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
      <p>Saved Layouts: </p>
      <select
        value={selectedSavedLayout} 
        onChange={(e) => chooseThisLayout(e.target.value, panelKey)}>
        <option value="">Select a saved layout</option>
        {savedLayoutNames.map((name) => (
          <option key={name} value={name}>
            {name}
          </option>
        ))}
      </select>
      </div>
      <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
        <p>Rows:</p>
        <button onClick={() => setNumRows((prev) => (prev > 1 ? prev - 1 : prev))}>&lt;</button>
        <p>{numRows}</p>
        <button onClick={() => setNumRows((prev) => (prev < components.length ? prev + 1 : prev))}>
          &gt;
        </button>

        <p>Columns:</p>
        <button onClick={() => setNumCols((prev) => (prev > 1 ? prev - 1 : prev))}>&lt;</button>
        <p>{numCols}</p>
        <button onClick={() => setNumCols((prev) => (prev < components.length ? prev + 1 : prev))}>
          &gt;
        </button>
      </div>

      <table>
        <tbody>
          {arr.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, colIndex) => (
                <td key={colIndex}>
                  <select
                    value={cell}
                    onChange={(e) =>
                      setArr((prev) =>
                        putInArray(rowIndex, colIndex, prev, e.target.value as ComponentName)
                      )
                    }>
                    <option value={-1} key={-1}></option>
                    {componentSelect}
                  </select>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{display: "flex",alignItems: "center", fontSize: "12px" , width: "100%"}}>
        <p style = {{ width: "30%"}}>Save your layout:</p>
        <input style = {{ width: "40%"}} type="text" placeholder="Layout name" value={currLayoutName || ''} onChange={(e) => setCurrLayoutName(e.target.value)} />
        <button  style = {{ width: "30%"}} onClick={() => saveLayout(arr, currLayoutName, panelKey)}>Save</button>
      </div> 
      <div>
      <button onClick={() => onSend(arr, panelKey)}>Set</button>
      <button onClick={() => setEdit(false)}>Close</button>
      </div>
        </div>
    </div>
  )
}
export default CustomizationPanel
