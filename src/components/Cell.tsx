import type { CellPosition } from '@/types'
import { SUDOKU_DIGITS } from '@/constants'

import './CellHintFlash.css'
import { HintSquareRipples } from './HintSquareRipples'

interface CellProps {
  position: CellPosition
  value: number
  notes: readonly number[]
  isIncorrect: boolean
  isHighlighted: boolean
  isSelected: boolean
  isHintFlash: boolean
  onSelect: (pos: CellPosition) => void
}

export function Cell({
  position,
  value,
  notes,
  isIncorrect,
  isHighlighted,
  isSelected,
  isHintFlash,
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
      onClick={() => onSelect(position)}
      role="button"
      tabIndex={0}
    >
      {isHintFlash && <HintSquareRipples />}
      {value !== 0 ? (
        value
      ) : (
        <span className="cell-notes-grid" aria-hidden>
          {SUDOKU_DIGITS.map((digit) => (
            <span key={digit} className="cell-note-digit">
              {notes.includes(digit) ? digit : ''}
            </span>
          ))}
        </span>
      )}
    </span>
  )
}
