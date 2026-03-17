import { useState, useMemo, useRef, useEffect } from 'react';
import type { Puzzle, CellPosition, UserInputsMap } from '@/types';
import { cellKey } from '@/utils';

export function useSudokuGame(puzzle: Puzzle) {
  const [userInputs, setUserInputs] = useState<UserInputsMap>(new Map());
  const [selectedCell, setSelectedCell] = useState<CellPosition>([-1, -1]);
  
  const solution = useMemo(
    () => puzzle.solution.map((row) => [...row]),
    [puzzle.solution]
  );

  const fixed = useMemo(
    () =>
      puzzle.board.map((row) => row.map((cell) => cell !== 0)),
    [puzzle.board]
  );
  
  const selectCell = (pos: CellPosition) => setSelectedCell(pos);
  
  const assignValue = (value: number) => {
    const [row, col] = selectedCell;
    if (fixed[row][col]) return;
    
    const isCorrect = solution[row][col] === value;
    setUserInputs((prev) => {
      const updated = new Map(prev);
      updated.set(cellKey(row, col), { value, isCorrect });
      return updated;
    });
  };
  
  const getCellValue = (row: number, col: number): number => {
    const input = userInputs.get(cellKey(row, col));
    return input ? input.value : puzzle.board[row][col];
  };

  const getCellValidation = (row: number, col: number): boolean | null => {
    const input = userInputs.get(cellKey(row, col));
    return input ? input.isCorrect : null;
  };
  
  const isCross = (pos: CellPosition): boolean =>
    selectedCell[0] === pos[0] || selectedCell[1] === pos[1];

  const isBlock = (pos: CellPosition): boolean => {
    const [row, col] = pos;
    return (
      Math.floor(row / 3) === Math.floor(selectedCell[0] / 3) &&
      Math.floor(col / 3) === Math.floor(selectedCell[1] / 3)
    );
  };
  
  const isSelected = (pos: CellPosition): boolean =>
    selectedCell[0] === pos[0] && selectedCell[1] === pos[1];
  
  const isKeyboardDisabled = (): boolean => {
    const [row, col] = selectedCell;
    return selectedCell[0] < 0 || (fixed[row]?.[col] ?? false);
  };
  
  const handlersRef = useRef({ assignValue, isKeyboardDisabled });
  handlersRef.current = { assignValue, isKeyboardDisabled };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const { assignValue, isKeyboardDisabled } = handlersRef.current;
      if (isKeyboardDisabled()) return;
      const num = parseInt(e.key, 10);
      if (num >= 1 && num <= 9) assignValue(num);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return {
    userInputs,
    selectedCell,
    solution,
    fixed,
    selectCell,
    assignValue,
    getCellValue,
    getCellValidation,
    isCross,
    isBlock,
    isSelected,
    isKeyboardDisabled,
  };
}
