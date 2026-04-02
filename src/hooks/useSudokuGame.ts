import { useState, useMemo, useRef, useEffect } from 'react'
import type { Puzzle, CellPosition, UserInput, UserInputsMap, CellNotesMap } from '@/types'
import { cellKey, isGridSolved, isCross, isBlock, isSelected } from '@/utils'
import { MAX_HINTS, MAX_MISTAKES } from '@/constants'
import { useSudokuKeyboard } from './useSudokuKeyboard'

type UndoEntry = {
  key: string
  before: UserInput | undefined
  notesBefore: number[]
  decrementHint: boolean
}

function snapshotNotes(notesMap: CellNotesMap, key: string): number[] {
  const set = notesMap.get(key)
  if (!set || set.size === 0) return []
  return [...set].sort((a, b) => a - b)
}

export function useSudokuGame(puzzle: Puzzle) {
  const [userInputs, setUserInputs] = useState<UserInputsMap>(new Map())
  const [cellNotes, setCellNotes] = useState<CellNotesMap>(new Map())
  const [notesMode, setNotesMode] = useState(false)
  const [selectedCell, setSelectedCell] = useState<CellPosition>([-1, -1])
  const [mistakes, setMistakes] = useState(0)
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const [timerStopped, setTimerStopped] = useState(false)
  const [hintsUsed, setHintsUsed] = useState(0)
  const [hintFlashCell, setHintFlashCell] = useState<CellPosition | null>(null)
  const [mistakeShake, setMistakeShake] = useState<{ pos: CellPosition; id: number } | null>(null)
  const mistakeShakeIdRef = useRef(0)
  const [undoStack, setUndoStack] = useState<UndoEntry[]>([])

  const solution = useMemo(
    () => puzzle.solution.map((row) => [...row]),
    [puzzle.solution]
  )
  const fixed = useMemo(
    () => puzzle.board.map((row) => row.map((cell) => cell !== 0)),
    [puzzle.board]
  )

  const gameOver = mistakes >= MAX_MISTAKES
  const gameWon = useMemo(
    () => isGridSolved(userInputs, puzzle.board, solution),
    [userInputs, puzzle.board, solution]
  )

  useEffect(() => {
    setUserInputs(new Map())
    setCellNotes(new Map())
    setNotesMode(false)
    setSelectedCell([-1, -1])
    setMistakes(0)
    setElapsedSeconds(0)
    setTimerStopped(false)
    setHintsUsed(0)
    setHintFlashCell(null)
    setMistakeShake(null)
    setUndoStack([])
  }, [puzzle])

  useEffect(() => {
    if (!mistakeShake) return
    const id = window.setTimeout(() => setMistakeShake(null), 750)
    return () => window.clearTimeout(id)
  }, [mistakeShake])

  useEffect(() => {
    if (!hintFlashCell) return
    const id = window.setTimeout(() => setHintFlashCell(null), 3100)
    return () => window.clearTimeout(id)
  }, [hintFlashCell])

  useEffect(() => {
    if (gameOver || timerStopped || gameWon) return
    const id = window.setInterval(() => {
      setElapsedSeconds((previousSeconds) => previousSeconds + 1)
    }, 1000)
    return () => window.clearInterval(id)
  }, [gameOver, puzzle, timerStopped, gameWon])

  const toggleTimer = () => {
    if (gameOver || gameWon) return
    setTimerStopped((previous) => !previous)
  }

  const selectCell = (pos: CellPosition) => setSelectedCell(pos)

  const moveSelection = (deltaRow: number, deltaCol: number) => {
    setSelectedCell((prev) => {
      if (prev[0] < 0) {
        return [0, 0]
      }
      const row = Math.max(0, Math.min(8, prev[0] + deltaRow))
      const col = Math.max(0, Math.min(8, prev[1] + deltaCol))
      return [row, col]
    })
  }
  const canEditSelected = (): boolean => {
    if (gameOver || gameWon || timerStopped) return false
    const [row, col] = selectedCell
    return selectedCell[0] >= 0 && !fixed[row][col]
  }

  const canToggleNotesAtCell = (): boolean => {
    if (!canEditSelected()) return false
    const [row, col] = selectedCell
    const key = cellKey(row, col)
    if (userInputs.has(key)) return false
    return puzzle.board[row][col] === 0
  }

  const toggleNotesMode = () => {
    setNotesMode((previous) => !previous)
  }

  const toggleNote = (value: number) => {
    if (!canToggleNotesAtCell()) return
    const [row, col] = selectedCell
    const key = cellKey(row, col)
    const notesBefore = snapshotNotes(cellNotes, key)
    const previous = userInputs.get(key)
    const beforeSnapshot = previous ? { ...previous } : undefined
    setCellNotes((prev) => {
      const updated = new Map(prev)
      const current = updated.get(key) ?? new Set<number>()
      const next = new Set(current)
      if (next.has(value)) next.delete(value)
      else next.add(value)
      if (next.size === 0) updated.delete(key)
      else updated.set(key, next)
      return updated
    })
    setUndoStack((stack) => [
      ...stack,
      {
        key,
        before: beforeSnapshot,
        notesBefore,
        decrementHint: false,
      },
    ])
  }

  const assignValue = (value: number) => {
    if (!canEditSelected()) return
    if (notesMode) {
      toggleNote(value)
      return
    }
    const [row, col] = selectedCell
    const key = cellKey(row, col)
    const notesBefore = snapshotNotes(cellNotes, key)
    const previous = userInputs.get(key)
    const beforeSnapshot = previous ? { ...previous } : undefined
    const isCorrect = solution[row][col] === value
    if (!isCorrect) {
      setMistakes((prev) => prev + 1)
      mistakeShakeIdRef.current += 1
      setMistakeShake({ pos: [row, col], id: mistakeShakeIdRef.current })
    }
    setUserInputs((prev) => {
      const updated = new Map(prev)
      updated.set(key, { value, isCorrect })
      return updated
    })
    setCellNotes((prev) => {
      const updated = new Map(prev)
      updated.delete(key)
      return updated
    })
    setUndoStack((stack) => [
      ...stack,
      {
        key,
        before: beforeSnapshot,
        notesBefore,
        decrementHint: false,
      },
    ])
  }
  const eraseValue = () => {
    if (!canEditSelected()) return
    const [row, col] = selectedCell
    const key = cellKey(row, col)
    const notes = cellNotes.get(key)
    if (notes && notes.size > 0) {
      const notesBefore = snapshotNotes(cellNotes, key)
      const previous = userInputs.get(key)
      const beforeSnapshot = previous ? { ...previous } : undefined
      setCellNotes((prev) => {
        const updated = new Map(prev)
        updated.delete(key)
        return updated
      })
      setUndoStack((stack) => [
        ...stack,
        {
          key,
          before: beforeSnapshot,
          notesBefore,
          decrementHint: false,
        },
      ])
      return
    }
    const input = userInputs.get(key)
    if (!input || input.isCorrect) return
    const beforeSnapshot = { ...input }
    const notesBefore = snapshotNotes(cellNotes, key)
    setUserInputs((prev) => {
      const updated = new Map(prev)
      updated.delete(key)
      return updated
    })
    setUndoStack((stack) => [
      ...stack,
      {
        key,
        before: beforeSnapshot,
        notesBefore,
        decrementHint: false,
      },
    ])
  }

  const undoLastMove = () => {
    if (timerStopped) return
    setUndoStack((stack) => {
      if (stack.length === 0) return stack
      const entry = stack[stack.length - 1]
      setUserInputs((prev) => {
        const updated = new Map(prev)
        if (entry.before === undefined) {
          updated.delete(entry.key)
        } else {
          updated.set(entry.key, entry.before)
        }
        return updated
      })
      setCellNotes((prev) => {
        const updated = new Map(prev)
        if (entry.notesBefore.length === 0) {
          updated.delete(entry.key)
        } else {
          updated.set(entry.key, new Set(entry.notesBefore))
        }
        return updated
      })
      if (entry.decrementHint) {
        setHintsUsed((count) => Math.max(0, count - 1))
      }
      return stack.slice(0, -1)
    })
  }

  const isUndoDisabled = (): boolean => timerStopped || undoStack.length === 0

  const getCellValue = (row: number, col: number): number => {
    const input = userInputs.get(cellKey(row, col))
    return input ? input.value : puzzle.board[row][col]
  }

  const getCellNotes = (row: number, col: number): number[] => {
    return snapshotNotes(cellNotes, cellKey(row, col))
  }

  const hintCandidates = (): CellPosition[] => {
    const candidatePositions: CellPosition[] = []
    for (let row = 0; row < 9; row++) {
      for (let column = 0; column < 9; column++) {
        if (fixed[row][column]) continue
        if (getCellValue(row, column) !== solution[row][column]) {
          candidatePositions.push([row, column])
        }
      }
    }
    return candidatePositions
  }

  const applyHint = () => {
    if (gameOver || gameWon || timerStopped) return
    if (hintsUsed >= MAX_HINTS) return

    const candidates = hintCandidates()
    if (candidates.length === 0) return

    const [selectedRow, selectedColumn] = selectedCell
    const preferSelected =
      selectedRow >= 0 &&
      candidates.some(
        ([row, column]) => row === selectedRow && column === selectedColumn
      )
    let row: number
    let col: number
    if (preferSelected) {
      row = selectedRow
      col = selectedColumn
    } else {
      const pick = candidates[Math.floor(Math.random() * candidates.length)]!
      row = pick[0]
      col = pick[1]
    }
    const key = cellKey(row, col)
    const previous = userInputs.get(key)
    const beforeSnapshot = previous ? { ...previous } : undefined
    const notesBefore = snapshotNotes(cellNotes, key)
    const value = solution[row][col]
    setUserInputs((prev) => {
      const updated = new Map(prev)
      updated.set(key, { value, isCorrect: true })
      return updated
    })
    setCellNotes((prev) => {
      const updated = new Map(prev)
      updated.delete(key)
      return updated
    })
    setHintsUsed((count) => count + 1)
    setUndoStack((stack) => [
      ...stack,
      {
        key,
        before: beforeSnapshot,
        notesBefore,
        decrementHint: true,
      },
    ])
    setHintFlashCell([row, col])
  }

  const isHintFlash = (pos: CellPosition): boolean =>
    hintFlashCell !== null && pos[0] === hintFlashCell[0] && pos[1] === hintFlashCell[1]

  const getMistakeShakeId = (pos: CellPosition): number | null => {
    if (!mistakeShake) return null
    if (pos[0] !== mistakeShake.pos[0] || pos[1] !== mistakeShake.pos[1]) return null
    return mistakeShake.id
  }

  const isHintDisabled = (): boolean =>
    gameOver ||
    gameWon ||
    timerStopped ||
    hintsUsed >= MAX_HINTS ||
    hintCandidates().length === 0

  const getCellValidation = (row: number, col: number): boolean | null => {
    const input = userInputs.get(cellKey(row, col))
    return input ? input.isCorrect : null
  }
  const isKeyboardDisabled = (): boolean => {
    if (gameOver || gameWon || timerStopped) return true
    if (notesMode) return !canToggleNotesAtCell()
    return !canEditSelected()
  }
  const isEraseDisabled = (): boolean => {
    if (gameOver || gameWon || timerStopped) return true
    const [row, col] = selectedCell
    if (selectedCell[0] < 0) return true
    const key = cellKey(row, col)
    const notes = cellNotes.get(key)
    if (notes && notes.size > 0) return false
    const input = userInputs.get(key)
    return !input || input.isCorrect
  }
  const handlersRef = useRef({
    assignValue,
    eraseValue,
    moveSelection,
    isKeyboardDisabled,
    isEraseDisabled,
    undoLastMove,
    isUndoDisabled,
    toggleNotesMode,
  })
  handlersRef.current = {
    assignValue,
    eraseValue,
    moveSelection,
    isKeyboardDisabled,
    isEraseDisabled,
    undoLastMove,
    isUndoDisabled,
    toggleNotesMode,
  }
  useSudokuKeyboard(handlersRef)

  return {
    userInputs,
    mistakes,
    elapsedSeconds,
    timerStopped,
    toggleTimer,
    gameOver,
    gameWon,
    selectedCell,
    solution,
    fixed,
    selectCell,
    assignValue,
    eraseValue,
    getCellValue,
    getCellNotes,
    getCellValidation,
    isCross: (pos: CellPosition) => isCross(selectedCell, pos),
    isBlock: (pos: CellPosition) => isBlock(selectedCell, pos),
    isSelected: (pos: CellPosition) => isSelected(selectedCell, pos),
    isKeyboardDisabled,
    isEraseDisabled,
    hintsRemaining: MAX_HINTS - hintsUsed,
    applyHint,
    isHintDisabled,
    isHintFlash,
    getMistakeShakeId,
    undoLastMove,
    isUndoDisabled,
    notesMode,
    toggleNotesMode,
  }
}
