type Coordinate = [number, number]

type ProcessedCustomizationPanelData = {
  coordinates: Coordinate[][]
  rowNum: number
  colNum: number
}

export function processCustomizationPanelData(
  data: (number | null)[][],
  components: unknown[],
  key: string
): ProcessedCustomizationPanelData {
  const arr: Coordinate[][] = Array.from({length: components.length}, () => [])

  for (let i = 0; i < data.length; i++) {
    for (let j = 0; j < data[i].length; j++) {
      const key = data[i][j]

      if (key != null && key !== -1) {
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
