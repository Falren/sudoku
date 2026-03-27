import '@/components/Board.css'
import { Cell } from './Cell'
import type { CellPosition } from '@/types'

export interface BoardProps {
  getCellValue: (row: number, col: number) => number
  getCellValidation: (row: number, col: number) => boolean | null
  isCross: (pos: CellPosition) => boolean
  isBlock: (pos: CellPosition) => boolean
  isSelected: (pos: CellPosition) => boolean
  isHintFlash: (pos: CellPosition) => boolean
  onSelectCell: (pos: CellPosition) => void
}

export function Board({
  getCellValue,
  getCellValidation,
  isCross,
  isBlock,
  isSelected,
  isHintFlash,
  onSelectCell,
}: BoardProps) {
  return (
    <div className="board">
      {Array.from({ length: 9 }, (_, rowIndex) => (
        <div className="board-row" key={rowIndex}>
          {Array.from({ length: 9 }, (_, cellIndex) => {
            const pos: CellPosition = [rowIndex, cellIndex]
            const value = getCellValue(rowIndex, cellIndex)
            const validation = getCellValidation(rowIndex, cellIndex)
            const isIncorrect = validation === false
            return (
              <Cell
                key={cellIndex}
                position={pos}
                value={value}
                isIncorrect={isIncorrect}
                isHighlighted={isBlock(pos) || isCross(pos)}
                isSelected={isSelected(pos)}
                isHintFlash={isHintFlash(pos)}
                onSelect={onSelectCell}
              />
            )
          })}
        </div>
      ))}
    </div>
  )
}
