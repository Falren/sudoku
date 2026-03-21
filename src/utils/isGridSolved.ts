import type { UserInputsMap } from '@/types'
import { cellKey } from './cellKey'

export function isGridSolved(
  userInputs: UserInputsMap,
  board: number[][],
  solution: number[][]
): boolean {
  for (let rowIndex = 0; rowIndex < 9; rowIndex++) {
    for (let colIndex = 0; colIndex < 9; colIndex++) {
      const input = userInputs.get(cellKey(rowIndex, colIndex))
      const value = input ? input.value : board[rowIndex][colIndex]
      if (value !== solution[rowIndex][colIndex]) return false
    }
  }
  return true
}
