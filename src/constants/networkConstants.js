const DEFAULT_ROVER_HOST =
  import.meta.env.VITE_ROVER_HOST || (import.meta.env.DEV ? 'localhost' : 'jetson-1.local')

export const getRoverServerUrl = () => {
  const host =
    (typeof localStorage !== 'undefined' && localStorage.getItem('roverHost')) || DEFAULT_ROVER_HOST
  return `ws://${host}:3001/mission-control`
}

export const ROVER_SERVER_URL = getRoverServerUrl()
