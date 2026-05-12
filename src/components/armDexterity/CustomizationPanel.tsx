import React, {useState, useEffect} from 'react'

interface CustomizationPanelProps {
  components: string[]
  onSend: (data: number[][]) => void
  edit: boolean
  defaultSettings: number[] // [defaultNumRows, defaultNumCols]
}

// populates an array with option elements for the dropdown menus
function populateArray(num: number) {
  let arr = []
  for (let i = 1; i <= num; i++) {
    arr.push(
      <option value={i} key={i}>
        {i}
      </option>
    )
  }
  return arr
}

function putInArray(row: number, col: number, arr: number[][], toPut: number) {
  const arrCopy = arr.map((row) => [...row])
  arrCopy[row][col] = toPut
  return arrCopy
}

// helper function to manage the array (representing the grid) state
function resize2DArray(rows: number, cols: number, arr: number[][]) {
  const arrCopy = arr.map((row) => [...row])
  // Case 1: row is less than current array row length - slice extra rows off
  if (rows < arr.length) {
    arrCopy.splice(rows, arr.length - rows)
  }
  // Case 2: row is greater than current array row length - add new rows to end (fill w/ -1)
  else if (rows > arr.length) {
    for (let i = arrCopy.length; i < rows; i++) {
      arrCopy.push(Array(cols).fill(-1))
    }
  }
  // Case 3: col is less than current array col length - slice extra cols off
  if (arr.length != 0 && cols < arr[0].length) {
    for (let i = 0; i < arrCopy.length; i++) {
      arrCopy[i].splice(cols, arrCopy[i].length - cols)
    }
  }
  // Case 4: col is greater than current array col length - add new cols to end (fill w/ -1)
  else if (arr.length != 0 && cols > arrCopy[0].length) {
    for (let i = 0; i < arrCopy.length; i++) {
      for (let j = arrCopy[i].length; j < cols; j++) {
        arrCopy[i].push(-1)
      }
    }
  }
  // Case 5/6: row/col equal to current array row/col length - do nothing
  return arrCopy
}

// sends array of coordinates back to parent component, will be same indexing as passed components array and
// have value of -1 if not selected, else will be coordinate in grid where component should be placed
function CustomizationPanel({components, edit, onSend, defaultSettings}: CustomizationPanelProps) {
  const [numRows, setNumRows] = useState(defaultSettings[0])
  const [numCols, setNumCols] = useState(defaultSettings[1])
  const [maxNumRows, setmaxNumRows] = useState(populateArray(components.length))
  const [maxNumCols, setmaxNumCols] = useState(populateArray(components.length))
  const [arr, setArr] = useState(Array<Array<number>>) // grid array
  const [componentSelect, setComponentSelect] = useState<JSX.Element[]>([]) // array of component options

  // sets up component options
  useEffect(() => {
    const selectOptions = components.map((component, index) => (
      <option value={index} key={index}>
        {component}
      </option>
    ))
    setComponentSelect(selectOptions)
  }, [])

  // updates grid array and the maximum number of rows when number of columns changes
  useEffect(() => {
    let i = Math.floor(components.length / numCols)
    if (components.length % numCols != 0) {
      i = Math.floor(components.length / numCols) + 1
    }
    setmaxNumRows(populateArray(i))
    setArr((prev) => resize2DArray(numRows, numCols, prev))
  }, [numCols])

  // updates grid array and the maximum number of columns when number of rows changes
  useEffect(() => {
    let i = Math.floor(components.length / numRows)
    if (components.length % numRows != 0) {
      i = Math.floor(components.length / numRows) + 1
    }
    setmaxNumCols(populateArray(i))
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
      <label htmlFor="row">Rows:</label>
      <select name="row" value={numRows} onChange={(e) => setNumRows(parseInt(e.target.value))}>
        {maxNumRows}
      </select>
      <label htmlFor="column">Columns:</label>
      <select name="column" value={numCols} onChange={(e) => setNumCols(parseInt(e.target.value))}>
        {maxNumCols}
      </select>
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
                        putInArray(rowIndex, colIndex, prev, parseInt(e.target.value))
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
      <button onClick={() => onSend(arr)}>Save/Close</button>
    </div>
  )
}
export default CustomizationPanel
