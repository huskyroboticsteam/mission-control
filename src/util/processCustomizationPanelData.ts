type Coordinate = [number, number]

interface ProcessedCustomizationPanelData {
  coordinates: Coordinate[][]
  rowNum: number
  colNum: number
}

export function processCustomizationPanelData(
  data: (number | null)[][],
  components: unknown[]
): ProcessedCustomizationPanelData {
  const arr: Coordinate[][] = Array.from({length: components.length}, () => [])

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
    colNum: data[0].length,
  }
}
