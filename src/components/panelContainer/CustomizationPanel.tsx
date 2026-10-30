import React, {useState, useEffect} from 'react'
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

type CustomizationPanelProps = {
  components: ComponentName[]
  panelKey: PanelKey
  onSend: (data: (string | null)[][], key: PanelKey) => void
  edit: boolean
  defaultSettings: number[] // [defaultNumRows, defaultNumCols]
}

function putInArray(row: number, col: number, arr: string[][], toPut: string) {
  const arrCopy = arr.map((row) => [...row])
  arrCopy[row][col] = toPut
  return arrCopy
}

// helper function to manage the array (representing the grid) state
function resize2DArray(rows: number, cols: number, arr: string[][]) {
  const arrCopy = arr.map((row) => [...row])
  // Case 1: row is less than current array row length - slice extra rows off
  if (rows < arr.length) {
    arrCopy.splice(rows, arr.length - rows)
  }
  // Case 2: row is greater than current array row length - add new rows to end (remains empty)
  else if (rows > arr.length) {
    for (let i = arrCopy.length; i < rows; i++) {
      arrCopy.push(Array(cols).fill(""))
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
        arrCopy[i].push("")
      }
    }
  }
  // Case 5/6: row/col equal to current array row/col length - do nothing
  return arrCopy
}

// sends array of coordinates back to parent component, will be same indexing as passed components array and
// have value of -1 if not selected, else will be coordinate in grid where component should be placed
function CustomizationPanel({
  components,
  panelKey,
  edit,
  onSend,
  defaultSettings,
}: CustomizationPanelProps) {
  const [numRows, setNumRows] = useState(defaultSettings[0])
  const [numCols, setNumCols] = useState(defaultSettings[1])
  const [arr, setArr] = useState(Array<Array<string>>()) // grid array
  const [componentSelect, setComponentSelect] = useState<JSX.Element[]>([]) // array of component options

  // sets up component options
  useEffect(() => {
    const selectOptions = components.map((component, index) => (
      <option value={component} key={index}>
        {component}
      </option>
    ))
    setComponentSelect(selectOptions)
  }, [])

  // updates grid array when number of columns changes
  useEffect(() => {
    let i = Math.floor(components.length / numCols)
    if (components.length % numCols != 0) {
      i = Math.floor(components.length / numCols) + 1
    }
    setArr((prev) => resize2DArray(numRows, numCols, prev))
  }, [numCols])

  // updates grid array when number of rows changes
  useEffect(() => {
    let i = Math.floor(components.length / numRows)
    if (components.length % numRows != 0) {
      i = Math.floor(components.length / numRows) + 1
    }
    setArr((prev) => resize2DArray(numRows, numCols, prev))
  }, [numRows])

  return (
    <div
      style={{
        display: edit ? 'block' : 'none',
        position: 'absolute',
        right: '0',
        bottom: '0',
        zIndex: 1000,
        backgroundColor: 'white',
        color: 'black',
      }}>
      <h1>Customization Panel</h1>
      <div>
        <p>Rows:</p>
        <button onClick={() => setNumRows((prev) => (prev > 1 ? prev - 1 : prev))}>&lt;</button>
        <p>{numRows}</p>
        <button onClick={() => setNumRows((prev) => (prev < components.length ? prev + 1 : prev))}>
          &gt;
        </button>
      </div>

      <div>
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
                        putInArray(rowIndex, colIndex, prev, e.target.value)
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
      <button onClick={() => onSend(arr, panelKey)}>Save/Close</button>
    </div>
  )
}
export default CustomizationPanel
