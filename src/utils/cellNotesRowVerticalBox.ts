import type { CellNotesMap, CellPosition } from '@/types'
import { cellKey } from './cellKey'

export function cellsInSameRowVerticalOrBox(rowIndex: number, columnIndex: number): CellPosition[] {
  const positions: CellPosition[] = []
  const seenKeys = new Set<string>()
  const addIfNew = (gridRow: number, gridColumn: number) => {
    if (gridRow === rowIndex && gridColumn === columnIndex) return
    const keyString = cellKey(gridRow, gridColumn)
    if (seenKeys.has(keyString)) return
    seenKeys.add(keyString)
    positions.push([gridRow, gridColumn])
  }
  for (let scanColumn = 0; scanColumn < 9; scanColumn++) {
    addIfNew(rowIndex, scanColumn)
  }
  for (let scanRow = 0; scanRow < 9; scanRow++) {
    addIfNew(scanRow, columnIndex)
  }
  const boxTopRow = Math.floor(rowIndex / 3) * 3
  const boxLeftColumn = Math.floor(columnIndex / 3) * 3
  for (let boxCellIndex = 0; boxCellIndex < 9; boxCellIndex++) {
    const boxRow = boxTopRow + Math.floor(boxCellIndex / 3)
    const boxColumn = boxLeftColumn + (boxCellIndex % 3)
    addIfNew(boxRow, boxColumn)
  }
  return positions
}

export function removeDigitFromNotesInSameRowVerticalOrBox(
  notesMap: CellNotesMap,
  rowIndex: number,
  columnIndex: number,
  digit: number
): CellNotesMap {
  const updated = new Map(notesMap)
  for (const [otherRow, otherColumn] of cellsInSameRowVerticalOrBox(rowIndex, columnIndex)) {
    const keyString = cellKey(otherRow, otherColumn)
    const candidateSet = updated.get(keyString)
    if (!candidateSet || !candidateSet.has(digit)) continue
    
    const candidatesAfterRemoval = new Set(candidateSet)
    candidatesAfterRemoval.delete(digit)
    if (candidatesAfterRemoval.size === 0) updated.delete(keyString)
    else updated.set(keyString, candidatesAfterRemoval)
  }
  return updated
}

export function serializeCellNotes(notesMap: CellNotesMap): Map<string, number[]> {
  const serialized = new Map<string, number[]>()
  for (const [cellKeyString, candidateSet] of notesMap) {
    serialized.set(cellKeyString, [...candidateSet].sort((first, second) => first - second))
  }
  return serialized
}

export function deserializeCellNotes(serialized: Map<string, number[]>): CellNotesMap {
  const notesMap = new Map<string, Set<number>>()
  for (const [cellKeyString, sortedDigits] of serialized) {
    notesMap.set(cellKeyString, new Set(sortedDigits))
  }
  return notesMap
}
