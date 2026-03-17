import type { CellPosition } from '@/types';

interface CellProps {
  position: CellPosition;
  value: number;
  isIncorrect: boolean;
  isHighlighted: boolean;
  isSelected: boolean;
  onSelect: (pos: CellPosition) => void;
}

export function Cell({
  position,
  value,
  isIncorrect,
  isHighlighted,
  isSelected,
  onSelect,
}: CellProps) {
  const cellClass = [
    'cell',
    isHighlighted && 'highlightArea',
    isSelected && 'selectedCell',
    isIncorrect && 'incorrect',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <span
      className={cellClass}
      onClick={() => onSelect(position)}
      role="button"
      tabIndex={0}
    >
      {value || ''}
    </span>
  );
}
