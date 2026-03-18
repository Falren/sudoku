import type { CellPosition } from '@/types'

export const isCross = (selected: CellPosition, pos: CellPosition): boolean =>
  selected[0] === pos[0] || selected[1] === pos[1]
export const isBlock = (selected: CellPosition, pos: CellPosition): boolean =>
  Math.floor(pos[0] / 3) === Math.floor(selected[0] / 3) &&
  Math.floor(pos[1] / 3) === Math.floor(selected[1] / 3)
export const isSelected = (selected: CellPosition, pos: CellPosition): boolean =>
  selected[0] === pos[0] && selected[1] === pos[1]