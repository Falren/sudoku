import type { CellPosition } from '@/types'

export { isCross, isBlock, isSelected } from './cellHelpers'
export function cellKey(row: number, col: number): string {
  return `${row},${col}`
}

export function parseCellKey(key: string): CellPosition {
  const [row, col] = key.split(',').map(Number)
  return [row, col]
}

export function formatElapsedSeconds(total: number): string {
  const minutes = Math.floor(total / 60)
  const seconds = total % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}
