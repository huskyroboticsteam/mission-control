export enum CameraNames {
  mast,
  hand,
  wrist
}

export const CAMERAS: {
  [C in keyof typeof CameraNames]: {
    id: number
  }
} = {
  mast: {
    id: 40
  },
  hand: {
    id: 20,
  },
  wrist: {
    id: 30
  }
}