import { useState, useMemo, useRef, useEffect } from 'react';
import type { Puzzle, CellPosition, UserInputsMap } from '@/types';
import { cellKey, isCross as isCrossUtil, isBlock as isBlockUtil, isSelected as isSelectedUtil } from '@/utils';
import { MAX_MISTAKES } from '@/constants';
import { useSudokuKeyboard } from './useSudokuKeyboard';

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
    () => puzzle.board.map((row) => row.map((cell) => cell !== 0)),
    [puzzle.board]
  );

  const selectCell = (pos: CellPosition) => setSelectedCell(pos);

  const canEditSelected = (): boolean => {
    if (gameOver) return false;
    const [row, col] = selectedCell;
    return selectedCell[0] >= 0 && !fixed[row][col];
  };

  const assignValue = (value: number) => {
    if (!canEditSelected()) return;
    const [row, col] = selectedCell;
    const isCorrect = solution[row][col] === value;
    if (!isCorrect) setMistakes((prev) => prev + 1);
    setUserInputs((prev) => {
      const updated = new Map(prev);
      updated.set(cellKey(row, col), { value, isCorrect });
      return updated;
    });
  };

  const eraseValue = () => {
    if (!canEditSelected()) return;
    const [row, col] = selectedCell;
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

  const isKeyboardDisabled = (): boolean => !canEditSelected();
  const isEraseDisabled = (): boolean =>
    isKeyboardDisabled() || !userInputs.has(cellKey(selectedCell[0], selectedCell[1]));

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

  useSudokuKeyboard(handlersRef);

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
    isCross: (pos: CellPosition) => isCrossUtil(selectedCell, pos),
    isBlock: (pos: CellPosition) => isBlockUtil(selectedCell, pos),
    isSelected: (pos: CellPosition) => isSelectedUtil(selectedCell, pos),
    isKeyboardDisabled,
    isEraseDisabled,
  };
}
