import type { CellPosition } from '@/types';

export { isCross, isBlock, isSelected } from './cellHelpers';

export function cellKey(row: number, col: number): string {
  return `${row},${col}`;
}

export function parseCellKey(key: string): CellPosition {
  const [row, col] = key.split(',').map(Number);
  return [row, col];
}
