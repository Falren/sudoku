import type { CellPosition } from '@/types'
import { SUDOKU_DIGITS } from '@/constants'

import './CellHintFlash.css'
import { HintSquareRipples } from './HintSquareRipples'

interface CellProps {
  position: CellPosition
  cellDataId: string
  value: number
  notes: readonly number[]
  noteDigitHasConflict: (digit: number) => boolean
  isIncorrect: boolean
  isHighlighted: boolean
  isSelected: boolean
  isHintFlash: boolean
  mistakeShakeId: number | null
  onSelect: (pos: CellPosition) => void
}

export function Cell({
  position,
  cellDataId,
  value,
  notes,
  noteDigitHasConflict,
  isIncorrect,
  isHighlighted,
  isSelected,
  isHintFlash,
  mistakeShakeId,
  onSelect,
}: CellProps) {
  const cellClass = [
    'cell',
    isHighlighted && 'highlightArea',
    isSelected && 'selectedCell',
    isIncorrect && 'incorrect',
    isHintFlash && 'cell-hint-flash',
  ]
    .filter(Boolean)
    .join(' ')
  return (
    <span
      className={cellClass}
      data-sudoku-cell={cellDataId}
      onClick={() => onSelect(position)}
      role="button"
      tabIndex={isSelected ? 0 : -1}
    >
      {isHintFlash && <HintSquareRipples />}
      {value !== 0 ? (
        <span
          className={mistakeShakeId != null ? 'cell-mistake-shake' : undefined}
          key={mistakeShakeId ?? 'digit'}
        >
          {value}
        </span>
      ) : (
        <span className="cell-notes-grid" aria-hidden>
          {SUDOKU_DIGITS.map((digit) => {
            const showNote = notes.includes(digit)
            const conflict = showNote && noteDigitHasConflict(digit)
            return (
              <span
                key={digit}
                className={['cell-note-digit', conflict && 'cell-note-conflict'].filter(Boolean).join(' ')}
              >
                {showNote ? digit : ''}
              </span>
            )
          })}
        </span>
      )}
    </span>
  )
}
