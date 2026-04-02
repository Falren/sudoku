import { useEffect, useRef } from 'react'

import '@/components/Board.css'
import { Cell } from './Cell'
import type { CellPosition } from '@/types'
import { cellKey } from '@/utils'

export interface BoardProps {
  selectedCell: CellPosition
  getCellValue: (row: number, col: number) => number
  getCellNotes: (row: number, col: number) => number[]
  getCellValidation: (row: number, col: number) => boolean | null
  isCross: (pos: CellPosition) => boolean
  isBlock: (pos: CellPosition) => boolean
  isSelected: (pos: CellPosition) => boolean
  isHintFlash: (pos: CellPosition) => boolean
  getMistakeShakeId: (pos: CellPosition) => number | null
  onSelectCell: (pos: CellPosition) => void
}

export function Board({
  selectedCell,
  getCellValue,
  getCellNotes,
  getCellValidation,
  isCross,
  isBlock,
  isSelected,
  isHintFlash,
  getMistakeShakeId,
  onSelectCell,
}: BoardProps) {
  const boardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const [row, col] = selectedCell
    if (row < 0 || col < 0) return
    const root = boardRef.current
    if (!root) return
    const id = cellKey(row, col)
    const el = root.querySelector<HTMLElement>(`[data-sudoku-cell="${id}"]`)
    el?.focus({ preventScroll: true })
  }, [selectedCell])

  return (
    <div className="board" ref={boardRef}>
      {Array.from({ length: 9 }, (_, rowIndex) => (
        <div className="board-row" key={rowIndex}>
          {Array.from({ length: 9 }, (_, cellIndex) => {
            const pos: CellPosition = [rowIndex, cellIndex]
            const value = getCellValue(rowIndex, cellIndex)
            const notes = getCellNotes(rowIndex, cellIndex)
            const validation = getCellValidation(rowIndex, cellIndex)
            const isIncorrect = validation === false
            return (
              <Cell
                key={cellIndex}
                position={pos}
                cellDataId={cellKey(rowIndex, cellIndex)}
                value={value}
                notes={notes}
                isIncorrect={isIncorrect}
                isHighlighted={isBlock(pos) || isCross(pos)}
                isSelected={isSelected(pos)}
                isHintFlash={isHintFlash(pos)}
                mistakeShakeId={getMistakeShakeId(pos)}
                onSelect={onSelectCell}
              />
            )
          })}
        </div>
      ))}
    </div>
  )
}
