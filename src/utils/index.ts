export { isCross, isBlock, isSelected } from './cellHelpers'
export { cellKey, parseCellKey } from './cellKey'
export {
  cellsInSameRowVerticalOrBox,
  removeDigitFromNotesInSameRowVerticalOrBox,
  serializeCellNotes,
  deserializeCellNotes,
} from './cellNotesRowVerticalBox'
export { isGridSolved } from './isGridSolved'
export { getPuzzlesForDifficulty } from './puzzleDifficulty'

export function formatElapsedSeconds(total: number): string {
  const minutes = Math.floor(total / 60)
  const seconds = total % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}
