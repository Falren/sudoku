import type { CellPosition } from '@/types'

import './CellHintFlash.css'
import { HintSquareRipples } from './HintSquareRipples'

interface CellProps {
  position: CellPosition
  value: number
  isIncorrect: boolean
  isHighlighted: boolean
  isSelected: boolean
  isHintFlash: boolean
  onSelect: (pos: CellPosition) => void
}

export function Cell({
  position,
  value,
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
      {value || ''}
    </span>
  )
}
