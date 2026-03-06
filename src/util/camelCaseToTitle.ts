export const camelCaseToTitle = (str: string) => {
  return (
    str[0].toUpperCase() +
    str
      .substring(1)
      .split(/(?=[A-Z])/)
      .join(' ')
  )
}
