import { useEffect, useRef, useState } from 'react'

import { HintIcon, PencilIcon, UndoIcon } from '@/assets/icons'
import { MAX_MISTAKES } from '@/constants'

import './GameToolbar.css'

type GameToolbarProps = {
  mistakes: number
  onHint: () => void
  hintsRemaining: number
  hintDisabled: boolean
  onUndo: () => void
  undoDisabled: boolean
  notesMode: boolean
  onToggleNotes: () => void
}

export function GameToolbar({
  mistakes,
  hintsRemaining,
  onHint,
  hintDisabled,
  onUndo,
  undoDisabled,
  notesMode,
  onToggleNotes,
}: GameToolbarProps) {
  const [mistakeFeedback, setMistakeFeedback] = useState(false)
  const [mistakeAnimKey, setMistakeAnimKey] = useState(0)
  const prevMistakes = useRef(mistakes)

  useEffect(() => {
    if (mistakes > prevMistakes.current) {
      setMistakeAnimKey((key) => key + 1)
      setMistakeFeedback(true)
      const id = window.setTimeout(() => setMistakeFeedback(false), 780)
      prevMistakes.current = mistakes
      return () => window.clearTimeout(id)
    }
    prevMistakes.current = mistakes
  }, [mistakes])

  return (
    <div className="game-toolbar">
      <div
        key={mistakeAnimKey}
        className={mistakeFeedback ? 'mistakes mistakes--mistake' : 'mistakes'}
      >
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
      <button
        type="button"
        className={
          notesMode
            ? 'redo-button toolbar-notes toolbar-notes--active'
            : 'redo-button toolbar-notes'
        }
        onClick={onToggleNotes}
        title="Notes (N)"
        aria-label="Notes"
        aria-pressed={notesMode}
      >
        <PencilIcon className="toolbar-notes-icon" />
      </button>
    </div>
  )
}
