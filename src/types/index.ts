export type CellPosition = [number, number]
export type Difficulty = 'easy' | 'medium' | 'hard'
export interface Puzzle {
  id: number
  difficulty: Difficulty
  board: number[][]
  solution: number[][]
  clues: number
}

export interface UserInput {
  value: number
  isCorrect: boolean
}

export type UserInputsMap = Map<string, UserInput>

export type CellNotesMap = Map<string, Set<number>>