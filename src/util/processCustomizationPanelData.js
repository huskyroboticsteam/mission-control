function processCustomizationPanelData(data, components) {
    const arr = Array.from({length: components.length}, () => [])
    for (let i = 0; i < data.length; i++) {
      for (let j = 0; j < data[i].length; j++) {
        const key = data[i][j]

        if (key !== -1 && key != null) {
          arr[key].push([i, j])
        }
      }
    }
    return {
      coordinates: arr,
      rowNum: data.length,
      colNum: data[0].length
    };
  }

  export default processCustomizationPanelData