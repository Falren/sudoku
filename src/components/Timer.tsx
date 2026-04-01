import '@/components/Timer.css'
import { formatElapsedSeconds } from '@/utils'
import { PauseIcon, PlayIcon } from '@/assets/icons'

interface TimerProps {
  elapsedSeconds: number
  timerStopped: boolean
  gameOver: boolean
  gameWon: boolean
  onToggleTimer: () => void
}

export function Timer({ elapsedSeconds, timerStopped, gameOver, gameWon, onToggleTimer }: TimerProps) {
  return (
    <div className="timer-row">
      <div className="timer">{formatElapsedSeconds(elapsedSeconds)}</div>
      <button
        type="button"
        className="redo-button game-header-icon-button"
        onClick={onToggleTimer}
        disabled={gameOver || gameWon}
        title={timerStopped ? 'Resume' : 'Pause'}
        aria-label={timerStopped ? 'Resume timer' : 'Pause timer'}
      >
        {timerStopped ? <PlayIcon /> : <PauseIcon />}
      </button>
    </div>
  )
}
