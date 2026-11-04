type Coordinate = [number, number]

type ProcessedCustomizationPanelData = {
  coordinates: Record<string, Coordinate[]>
  rowNum: number
  colNum: number
}
type ComponentName =
  | 'cam'
  | 'compass'
  | 'gps'
  | 'waypointlist'
  | 'waypointnav'
  | 'driveGP'
  | 'peripheralGP'
  | 'keyboard'
  | ''

export function processCustomizationPanelData(
  data: (ComponentName | null)[][]
): ProcessedCustomizationPanelData {
  const coordMap: Partial<Record<ComponentName, Coordinate[]>> = {}
  for (let i = 0; i < data.length; i++) {
    for (let j = 0; j < data[i].length; j++) {
      const componentName = data[i][j]

      if (componentName != null && componentName !== '') {
        coordMap[componentName] = [...(coordMap[componentName] || []), [i, j]]
      }
    }
  }

  return {
    coordinates: coordMap,
    rowNum: data.length,
    colNum: data[0].length,
  }
}
