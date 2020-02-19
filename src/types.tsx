export type Attempt = {
  x: number
  y: number
}

export type Segment = {
  name: string | null
  pbTime: number | null
  goldTime: number | null
  attemptHistory: Attempt[] | null
}
