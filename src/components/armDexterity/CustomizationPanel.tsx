import React, {useState, useEffect} from 'react';


interface CustomizationPanelProps {
    components: string[];
}


function populateArray(num: number) {
    let arr = [];
    for (let i=1; i<=num; i++) {
        arr.push(<option value={i} key = {i}>{i}</option>);
    }
    return arr;
}

function resize2DArray(rows: number, cols: number, arr: number[][]) {
    // Case 1: row is less than current array row length - slice extra rows off
    if (rows < arr.length) {
        arr.splice(rows, arr.length - rows);
    }
    // Case 2: row is greater than current array row length - add new rows to end (fill w/ -1)
    else if (rows > arr.length) {
        for (let i = arr.length; i < rows; i++) {
            arr.push(Array(cols).fill(-1));
        }
    }
    // Case 3: col is less than current array col length - slice extra cols off
    if (cols < arr[0].length) {
        for (let i = 0; i < arr.length; i++) {
            arr[i].splice(cols, arr[i].length - cols);
        }
    }
    // Case 4: col is greater than current array col length - add new cols to end (fill w/ -1)
    else if (cols > arr[0].length) {
        for (let i = 0; i < arr.length; i++) {
            for (let j = arr[i].length; j < cols; j++) {
                arr[i].push(-1);
            }
        }
    }

    return arr;
    // Case 5/6: row/col equal to current array row/col length - do nothing
}

export default function CustomizationPanel({ components }: CustomizationPanelProps) {
    const [numRows, setNumRows] = useState(1);
    const [numCols, setNumCols] = useState(1);
    const [totalNumRows, setTotalNumRows] = useState(populateArray(components.length));
    const [totalNumCols, setTotalNumCols] = useState(populateArray(components.length));
    const [arr, setArr] = useState(Array(numRows).fill(Array(numCols).fill(-1)));
    //let arr: number[][] = Array(numRows).fill(Array(numCols).fill(-1));

    //populateArray(components.length);
    //populateArray(totalNumCols, components.length);

    useEffect(() => {
        let i = Math.floor(components.length / numCols);
        if (components.length % numCols != 0) {
            i = Math.floor(components.length / numCols) + 1;
        }
        setTotalNumRows(populateArray(i));
        setArr(prev => resize2DArray(numRows, numCols, prev));
        console.log(arr);
    }, [numCols]);

    useEffect(() => {
        let i = Math.floor(components.length / numRows);
        if (components.length % numRows != 0) {
            i = Math.floor(components.length / numRows) + 1;
        }
        setTotalNumCols(populateArray(i));
        setArr(prev => resize2DArray(numRows, numCols, prev));
        console.log(arr);
    }, [numRows]);


    return (
        <div>
            <h1>Customization Panel</h1>
            <label htmlFor='row'>Rows:</label>
            <select name='row' value={numRows} onChange={(e) => setNumRows(parseInt(e.target.value))}>
                {totalNumRows}
            </select>
            <label htmlFor='column'>Columns:</label>
            <select name='column' value = {numCols} onChange={(e) => setNumCols(parseInt(e.target.value))}>
                {totalNumCols}
            </select>
        </div>
    );
}