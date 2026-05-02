export const enumKeys = <T extends object>(enumObj: T) => {
  return Object.keys(enumObj).filter(isNaN as any) as Array<keyof T>
}
