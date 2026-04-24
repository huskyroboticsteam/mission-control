import React, {useState, useEffect} from 'react'

interface CustomizationPanelProps {
  components: string[]
  onSend: (data: number[][]) => void
  edit: boolean
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

  return arrCopy
  // Case 5/6: row/col equal to current array row/col length - do nothing
}

export default function CustomizationPanel({components, edit, onSend}: CustomizationPanelProps) {
  const [numRows, setNumRows] = useState(1)
  const [numCols, setNumCols] = useState(1)
  const [totalNumRows, setTotalNumRows] = useState(populateArray(components.length))
  const [totalNumCols, setTotalNumCols] = useState(populateArray(components.length))
  const [arr, setArr] = useState(Array<Array<number>>)
  const [componentSelect, setComponentSelect] = useState<JSX.Element[]>([])
  const [show, setShow] = useState(edit)

  useEffect(() => {
    const selectOptions = components.map((component, index) => (
      <option value={index} key={index}>
        {component}
      </option>
    ))
    setComponentSelect(selectOptions)
  }, [])

  //let arr: number[][] = Array(numRows).fill(Array(numCols).fill(-1));

  //populateArray(components.length);
  //populateArray(totalNumCols, components.length);

  useEffect(() => {
    let i = Math.floor(components.length / numCols)
    if (components.length % numCols != 0) {
      i = Math.floor(components.length / numCols) + 1
    }
    setTotalNumRows(populateArray(i))
    setArr((prev) => resize2DArray(numRows, numCols, prev))
  }, [numCols])

  useEffect(() => {
    let i = Math.floor(components.length / numRows)
    if (components.length % numRows != 0) {
      i = Math.floor(components.length / numRows) + 1
    }
    setTotalNumCols(populateArray(i))
    setArr((prev) => resize2DArray(numRows, numCols, prev))
  }, [numRows])

  return (
    <div style={{ display: edit ? "block" : "none" }}>
      <h1>Customization Panel</h1>
      <label htmlFor="row">Rows:</label>
      <select name="row" value={numRows} onChange={(e) => setNumRows(parseInt(e.target.value))}>
        {totalNumRows}
      </select>
      <label htmlFor="column">Columns:</label>
      <select name="column" value={numCols} onChange={(e) => setNumCols(parseInt(e.target.value))}>
        {totalNumCols}
      </select>
      <table border={1}>
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
