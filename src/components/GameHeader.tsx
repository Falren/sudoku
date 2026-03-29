import type { Difficulty } from '@/types'
import type { Theme } from '@/hooks'

import { DifficultySelector } from './DifficultySelector.tsx'
import { ThemeToggle } from './ThemeToggle.tsx'
import { Timer } from './Timer.tsx'

import './GameHeader.css'

type GameHeaderProps = {
  theme: Theme
  onToggleTheme: () => void
  difficulty: Difficulty
  onDifficultyChange: (next: Difficulty) => void
  elapsedSeconds: number
  timerStopped: boolean
  gameOver: boolean
  gameWon: boolean
  onToggleTimer: () => void
}

export function GameHeader({
  theme,
  onToggleTheme,
  difficulty,
  onDifficultyChange,
  elapsedSeconds,
  timerStopped,
  gameOver,
  gameWon,
  onToggleTimer,
}: GameHeaderProps) {
  return (
    <header className="game-header">
      <div className="game-header-left">
        <ThemeToggle theme={theme} onToggle={onToggleTheme} />
      </div>
      <div className="game-header-center">
        <DifficultySelector value={difficulty} onChange={onDifficultyChange} />
      </div>
      <div className="game-header-right">
        <Timer
          elapsedSeconds={elapsedSeconds}
          timerStopped={timerStopped}
          gameOver={gameOver}
          gameWon={gameWon}
          onToggleTimer={onToggleTimer}
        />
      </div>
    </header>
  )
}
