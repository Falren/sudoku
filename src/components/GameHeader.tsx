import { RefreshIcon } from '@/assets/icons'
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
  won: boolean
  onDifficultyChange: (next: Difficulty) => void
  onNewGame: () => void
  onToggleTimer: () => void
}

export function GameHeader({
  difficulty,
  mistakes,
  elapsedSeconds,
  timerStopped,
  gameOver,
  won,
  onDifficultyChange,
  onNewGame,
  onToggleTimer,
}: GameHeaderProps) {
  return (
    <div className="header">
      <Timer
        elapsedSeconds={elapsedSeconds}
        timerStopped={timerStopped}
        gameOver={gameOver}
        won={won}
        onToggleTimer={onToggleTimer}
      />
      <div className="mistakes">
        Mistakes: {mistakes} / {MAX_MISTAKES}
      </div>
      <DifficultySelector value={difficulty} onChange={onDifficultyChange} />
      <button className="redo-button" onClick={onNewGame} title="New Game" aria-label="New Game">
        <RefreshIcon />
      </button>
    </div>
  )
}
