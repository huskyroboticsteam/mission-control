import React, {useState, useEffect} from 'react'
import {setItem} from '../../util/localStorage.js'
import type {Coordinate, ComponentName, PanelKey} from '../../constants/types.js'

// Parameters for customization panel
type CustomizationPanelProps = {
  prevCoordinates: Partial<Record<ComponentName, Coordinate[] | null>> | undefined
  components: ComponentName[]
  panelKey: PanelKey // determines which panel this customization panel is for (nav/arm dexterity/help)
  numRowsP: number // holds data on previous # of rows
  numColsP: number // holds data on previous # of columns
  onSend: (data: (ComponentName | null)[][], key: PanelKey) => void
  edit: boolean
  defaultSettings: number[] // [defaultNumRows, defaultNumCols]
  setEdit: (edit: boolean) => void
}

// Data is passed to customization panel as a component as a map of component names to coordinates
// for easy readibility, but we want to work with it in 2D array form to represent the grid layout.
// This function converts the map to the 2D array representation of the grid layout
function convertComponentToCoordMap(
  prevCoordinates: Partial<Record<ComponentName, Coordinate[] | null>> | undefined,
  numRows: number,
  numCols: number
): Array<Array<ComponentName>> {
  const rows = numRows
  const cols = numCols

  const arr: Array<Array<ComponentName>> = Array.from({length: rows}, () =>
    Array(cols).fill('' as ComponentName)
  )

  Object.entries(prevCoordinates ?? {}).forEach(([component, coordinates]) => {
    coordinates?.forEach(([row, col]) => {
      if (!arr[row]) {
        arr[row] = Array(cols).fill('' as ComponentName)
      }
      arr[row][col] = component as ComponentName
    })
  })
  return arr
}

// Helper function to put a component into a 2D array at a specific row and column
function putInArray(row: number, col: number, arr: ComponentName[][], toPut: ComponentName) {
  const arrCopy = arr.map((row) => [...row])
  arrCopy[row][col] = toPut
  return arrCopy
}

// Helper function to manage the array (representing the grid) state
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

// Convert layout to string
// layout structure: first line is numRows, numCols
//                   remaining lines are formatted like coordinate : component
//                   new line for each coord mapping
function convertToString(layoutToSave: Array<Array<ComponentName>>): string {
  let s = layoutToSave.length + ',' + layoutToSave[0].length + '\n'
  for (let i = 0; i < layoutToSave.length; i++) {
    for (let j = 0; j < layoutToSave[i].length; j++) {
      if (layoutToSave[i][j] !== '') {
        s += i + ',' + j + ':' + layoutToSave[i][j]
        s += '\n'
      }
    }
  }
  return s
}

// Gets the names of saved layouts for a given key from localStorage
function getSavedLayoutNames(key: string) {
  const keys = Object.keys(localStorage)
    .filter((k) => k.startsWith(key))
    .map((k) => k.split(': ')[1]) // grabs only name not associated key
  return keys
}

// Convert string to layout (2d array of components that represents the grid layout)
function convertStringToLayout(layoutString: string): Array<Array<ComponentName>> {
  const lines = layoutString.split('\n')
  const [numRows, numCols] = lines[0].split(',').map(Number)
  const layout: ComponentName[][] = Array.from({length: numRows}, () =>
    Array.from({length: numCols}, () => '')
  )

  for (let i = 1; i < lines.length; i++) {
    const [coords, component] = lines[i].split(':')
    const [row, col] = coords.split(',').map(Number)
    if (!(row === undefined || col === undefined || component === undefined)) {
      layout[row][col] = component as ComponentName
    }
  }
  return layout
}

// On closure, returns a 2D array of components back to parent component
// Will contain an empty string in a (row,col) pair if there is no component selected in the area
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
  ) // 2D array representing the grid layout of components
  const [componentSelect, setComponentSelect] = useState<JSX.Element[]>([]) // arr of component options
  const [currLayoutName, setCurrLayoutName] = useState<string | null>(null) // Name for saved layout
  const [savedLayoutNames, setSavedLayoutNames] = useState<string[]>(getSavedLayoutNames(panelKey))

  // Populates component options on start
  useEffect(() => {
    const selectOptions = components.map((component, index) => (
      <option value={component} key={index}>
        {component}
      </option>
    ))
    setComponentSelect(selectOptions)
  }, [])

  // Updates grid array when number of columns or rows changes
  useEffect(() => {
    setArr((prev) => resize2DArray(numRows, numCols, prev))
  }, [numCols, numRows])

  function saveLayout(layoutToSave: Array<Array<ComponentName>>, name: string | null, key: string) {
    const saveName = name ?? 'unnamed'
    const layoutString = convertToString(layoutToSave)
    // update saved layout names list
    if (!savedLayoutNames.includes(saveName)) {
      setSavedLayoutNames((prev) => [...prev, saveName])
    }
    if (name != null) {
      name = key + ': ' + name
    } else {
      name = key + ': unnamed'
    }
    setItem(name, layoutString)
    setCurrLayoutName(null)
  }

  function chooseThisLayout(layoutName: string, key: string) {
    const str = localStorage.getItem(key + ': ' + layoutName)
    if (str != null) {
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
      <div style={{margin: '5px'}}>
        <h1>Customization Panel</h1>
        <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
          <p>Saved Layouts: </p>
          <select
            defaultValue=""
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
          <button
            onClick={() => setNumRows((prev) => (prev < components.length ? prev + 1 : prev))}>
            &gt;
          </button>

          <p>Columns:</p>
          <button onClick={() => setNumCols((prev) => (prev > 1 ? prev - 1 : prev))}>&lt;</button>
          <p>{numCols}</p>
          <button
            onClick={() => setNumCols((prev) => (prev < components.length ? prev + 1 : prev))}>
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
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            fontSize: '12px',
            width: '100%',
            gap: '10px',
          }}>
          <p>Save your layout:</p>
          <input
            type="text"
            placeholder="Layout name"
            value={currLayoutName || ''}
            onChange={(e) => setCurrLayoutName(e.target.value)}
          />
          <button onClick={() => saveLayout(arr, currLayoutName, panelKey)}>Save</button>
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
