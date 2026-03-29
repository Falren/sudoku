import { HintIcon, RefreshIcon, UndoIcon } from '@/assets/icons'
import { MAX_MISTAKES } from '@/constants'
import type { Difficulty } from '@/types'

import { DifficultySelector } from './DifficultySelector.tsx'
import { Timer } from './Timer.tsx'

type GameHeaderProps = {
  difficulty: Difficulty
  mistakes: number
  elapsedSeconds: number
  timerStopped: boolean
  gameOver: boolean
  gameWon: boolean
  onDifficultyChange: (next: Difficulty) => void
  onNewGame: () => void
  onToggleTimer: () => void
  onHint: () => void
  hintsRemaining: number
  hintDisabled: boolean
  onUndo: () => void
  undoDisabled: boolean
}

export function GameHeader({
  difficulty,
  mistakes,
  elapsedSeconds,
  timerStopped,
  gameOver,
  gameWon,
  onDifficultyChange,
  onNewGame,
  onToggleTimer,
  hintsRemaining,
  onHint,
  hintDisabled,
  onUndo,
  undoDisabled,
}: GameHeaderProps) {
  return (
    <div className="header">
      <Timer
        elapsedSeconds={elapsedSeconds}
        timerStopped={timerStopped}
        gameOver={gameOver}
        gameWon={gameWon}
        onToggleTimer={onToggleTimer}
      />
      <div className="mistakes">
        Mistakes: {mistakes} / {MAX_MISTAKES}
      </div>
      <DifficultySelector value={difficulty} onChange={onDifficultyChange} />
      <button
        type="button"
        className="redo-button"
        onClick={onUndo}
        disabled={undoDisabled}
        title="Undo (⌘Z / Ctrl+Z)"
      >
        <UndoIcon />
      </button>
      <button
        type="button"
        className="redo-button"
        onClick={onHint}
        disabled={hintDisabled}
        title={`Hint (${hintsRemaining} left)`}
      >
        <HintIcon />
      </button>
      <button type="button" className="redo-button" onClick={onNewGame} title="New Game">
        <RefreshIcon />
      </button>
    </div>
  )
}
