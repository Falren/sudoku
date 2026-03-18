import { useState, useMemo, useRef, useEffect } from 'react';
import type { Puzzle, CellPosition, UserInputsMap } from '@/types';
import { cellKey } from '@/utils';
import { MAX_MISTAKES, ERASE_KEY } from '@/constants';

export function useSudokuGame(puzzle: Puzzle) {
  const [userInputs, setUserInputs] = useState<UserInputsMap>(new Map());
  const [selectedCell, setSelectedCell] = useState<CellPosition>([-1, -1]);
  const [mistakes, setMistakes] = useState(0);
  const gameOver = mistakes >= MAX_MISTAKES;
  useEffect(() => {
    setUserInputs(new Map());
    setSelectedCell([-1, -1]);
    setMistakes(0);
  }, [puzzle]);

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
    if (gameOver) return;
    const [row, col] = selectedCell;
    if (fixed[row][col]) return;

    const isCorrect = solution[row][col] === value;
    if (!isCorrect) setMistakes((prev) => prev + 1);

    setUserInputs((prev) => {
      const updated = new Map(prev);
      updated.set(cellKey(row, col), { value, isCorrect });
      return updated;
    });
  };

  const eraseValue = () => {
    if (gameOver) return;
    
    const [row, col] = selectedCell;
    if (fixed[row][col]) return;
    if (!userInputs.has(cellKey(row, col))) return;

    setUserInputs((prev) => {
      const updated = new Map(prev);
      updated.delete(cellKey(row, col));
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
    if (gameOver) return true;
    const [row, col] = selectedCell;
    return selectedCell[0] < 0 || (fixed[row]?.[col] ?? false);
  };

  const isEraseDisabled = (): boolean => {
    if (gameOver) return true;
    const [row, col] = selectedCell;
    return (
      selectedCell[0] < 0 ||
      (fixed[row]?.[col] ?? false) ||
      !userInputs.has(cellKey(row, col))
    );
  };

  const handlersRef = useRef({
    assignValue,
    eraseValue,
    isKeyboardDisabled,
    isEraseDisabled,
  });
  handlersRef.current = {
    assignValue,
    eraseValue,
    isKeyboardDisabled,
    isEraseDisabled,
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const { assignValue, eraseValue, isKeyboardDisabled, isEraseDisabled } = handlersRef.current;
      const isEraseKey = e.key === ERASE_KEY;
      if (isEraseKey && !isEraseDisabled()) eraseValue();
      if (isKeyboardDisabled() || isEraseKey) return;
      const num = parseInt(e.key, 10);
      if (num >= 1 && num <= 9) assignValue(num);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return {
    userInputs,
    mistakes,
    gameOver,
    selectedCell,
    solution,
    fixed,
    selectCell,
    assignValue,
    eraseValue,
    getCellValue,
    getCellValidation,
    isCross,
    isBlock,
    isSelected,
    isKeyboardDisabled,
    isEraseDisabled,
  };
}
