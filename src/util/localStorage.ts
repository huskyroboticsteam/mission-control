export const getItem = (key: string) => {
  try {
    const raw = localStorage.getItem(key)
    if (raw) {
      const json = JSON.parse(raw)
      return json
    }
  } catch (err) {
    console.log(err)
  }
  return null
}

export const setItem = (key: string, data: string) => {
  localStorage.setItem(key, data)
}
