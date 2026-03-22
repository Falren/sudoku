import { Board, type BoardProps } from './Board.tsx'

type BoardPanelProps = {
  board: BoardProps
  showPauseOverlay: boolean
}

export function BoardPanel({ board, showPauseOverlay }: BoardPanelProps) {
  return (
    <div className="board-shell">
      <Board {...board} />
      {showPauseOverlay && (
        <div className="board-pause-overlay" role="status" aria-live="polite">
          <span className="board-pause-caption">Pause</span>
        </div>
      )}
    </div>
  )
}
