import '@/components/Timer.css'
import { formatElapsedSeconds } from '@/utils'
import { PauseIcon, PlayIcon } from '@/assets/icons'

interface TimerProps {
  elapsedSeconds: number
  timerStopped: boolean
  gameOver: boolean
  won: boolean
  onToggleTimer: () => void
}

export function Timer({ elapsedSeconds, timerStopped, gameOver, won, onToggleTimer }: TimerProps) {
  return (
    <div className="timer-row">
      <div className="timer">{formatElapsedSeconds(elapsedSeconds)}</div>
      <button
        type="button"
        className="redo-button timer-toggle"
        onClick={onToggleTimer}
        disabled={gameOver || won}
      >
        {timerStopped ? <PlayIcon /> : <PauseIcon />}
      </button>
    </div>
  )
}
