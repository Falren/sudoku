import { HintIcon, RefreshIcon, UndoIcon } from '@/assets/icons'
import { MAX_MISTAKES } from '@/constants'

import './GameToolbar.css'

type GameToolbarProps = {
  mistakes: number
  onHint: () => void
  hintsRemaining: number
  hintDisabled: boolean
  onUndo: () => void
  undoDisabled: boolean
  onNewGame: () => void
}

export function GameToolbar({
  mistakes,
  hintsRemaining,
  onHint,
  hintDisabled,
  onUndo,
  undoDisabled,
  onNewGame,
}: GameToolbarProps) {
  return (
    <div className="game-toolbar">
      <div className="mistakes">
        Mistakes: {mistakes} / {MAX_MISTAKES}
      </div>
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
