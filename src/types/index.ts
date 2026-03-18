export type CellPosition = [number, number]
export interface Puzzle {
  id: number
  board: number[][]
  solution: number[][]
  clues: number
}

export interface UserInput {
  value: number
  isCorrect: boolean
}

export type UserInputsMap = Map<string, UserInput>