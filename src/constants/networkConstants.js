export const ROVER_SERVER_URL =
  process.env.NODE_ENV && process.env.NODE_ENV === 'development'
    ? 'ws://localhost:3001/mission-control'
    : 'ws://jetson-1.local:3001/mission-control'
