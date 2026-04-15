import React, {useState, useEffect} from 'react';


interface CustomizationPanelProps {
    components: string[];
}


function populateArray(num: number) {
    let arr = [];
    for (let i=1; i<=num; i++) {
        arr.push(<option value={i}>{i}</option>);
    }
    return arr;
}

export default function CustomizationPanel({ components }: CustomizationPanelProps) {
    const [numRows, setNumRows] = useState(1);
    const [numCols, setNumCols] = useState(1);
    const [totalNumRows, setTotalNumRows] = useState(populateArray(components.length));
    const [totalNumCols, setTotalNumCols] = useState(populateArray(components.length));

    //populateArray(components.length);
    //populateArray(totalNumCols, components.length);

    useEffect(() => {
        let i = Math.floor(components.length / numCols);
        if (components.length % numCols != 0) {
            i = Math.floor(components.length / numCols) + 1;
        }
        setTotalNumRows(populateArray(i));
    }, [numCols]);

    useEffect(() => {
        let i = Math.floor(components.length / numRows);
        if (components.length % numRows != 0) {
            i = Math.floor(components.length / numRows) + 1;
        }
        setTotalNumCols(populateArray(i));
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