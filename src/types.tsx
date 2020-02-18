export type Attempt = {
  x: number
  y: number
}

export type Segment = {
  name: string
  pbTime: number
  goldTime: number
  SegmentHistory: Attempt[] | null
}
