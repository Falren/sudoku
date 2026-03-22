import type { Difficulty, Puzzle } from '@/types'

export function getPuzzlesForDifficulty(all: Puzzle[], difficulty: Difficulty): Puzzle[] {
  return all.filter((p) => p.difficulty === difficulty)
}
