type Coordinate = [number, number]

type ProcessedCustomizationPanelData = {
  coordinates: Map<string, Coordinate[]>
  rowNum: number
  colNum: number
}

export function processCustomizationPanelData(
  data: (string | null)[][],
  components: unknown[],
  key: string
): ProcessedCustomizationPanelData {
  const coordMap = new Map<string, Coordinate[]>()

  for (let i = 0; i < data.length; i++) {
    for (let j = 0; j < data[i].length; j++) {
      const componentName = data[i][j]

      if (componentName != null && componentName !== "") {
        coordMap.set(componentName, [...(coordMap.get(componentName) || []), [i, j]])
      }
    }
  }

  return {
    coordinates: coordMap,
    rowNum: data.length,
    colNum: data[0].length,
  }
}
