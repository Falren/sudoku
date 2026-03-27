import { formatElapsedSeconds } from '@/utils'

type EndgameOverlayProps = {
  variant: 'gameOver' | 'win' | null
  elapsedSeconds: number
  onNewGame: () => void
}

export function EndgameOverlay({ variant, elapsedSeconds, onNewGame }: EndgameOverlayProps) {
  if (variant === null) {
    return null
  }
  if (variant === 'gameOver') {
    return (
      <div className="endgame-overlay">
        <div className="endgame-message">
          <div>Game Over</div>
          <button className="redo-button" onClick={onNewGame} title="New Game">
            New Game
          </button>
        </div>
      </div>
    )
  }
  return (
    <div className="endgame-overlay">
      <div className="endgame-message endgame-message-win">
        <div>You solved it!</div>
        <div className="endgame-sub">Time {formatElapsedSeconds(elapsedSeconds)}</div>
        <button className="redo-button" onClick={onNewGame} title="New Game">
          New Game
        </button>
      </div>
    </div>
  )
}
