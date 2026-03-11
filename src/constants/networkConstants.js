const roverHost =
  import.meta.env.VITE_ROVER_HOST || (import.meta.env.DEV ? 'localhost' : 'jetson-1.local')

export const ROVER_SERVER_URL = `ws://${roverHost}:3001/mission-control`
