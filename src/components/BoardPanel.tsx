import { useLayoutEffect } from 'react'

import { UNPAUSE_KEY } from '@/constants'

import { Board, type BoardProps } from './Board.tsx'

type BoardPanelProps = {
  board: BoardProps
  showPauseOverlay: boolean
  unpauseIfPaused: () => boolean
}

const PAUSE_ESCAPE_OPTIONS = { capture: true } as const

export function BoardPanel({ board, showPauseOverlay, unpauseIfPaused }: BoardPanelProps) {
  useLayoutEffect(() => {
    if (!showPauseOverlay) return
    const onKeyDown = (event: KeyboardEvent) => {
      const isEscape = event.key === UNPAUSE_KEY || event.code === UNPAUSE_KEY
      if (!isEscape) return
      if (unpauseIfPaused()) {
        event.preventDefault()
        event.stopPropagation()
      }
    }
    document.addEventListener('keydown', onKeyDown, PAUSE_ESCAPE_OPTIONS)
    return () => document.removeEventListener('keydown', onKeyDown, PAUSE_ESCAPE_OPTIONS)
  }, [showPauseOverlay, unpauseIfPaused])

  return (
    <div className="board-shell">
      <div className="board-area-with-overlay">
        <Board {...board} />
        {showPauseOverlay && (
          <div className="board-pause-overlay" role="status" aria-live="polite">
            <span className="board-pause-caption">Pause</span>
          </div>
        )}
      </div>
      {showPauseOverlay && (
        <p className="board-pause-hint-below" aria-hidden="true">
          <kbd className="board-pause-kbd board-pause-kbd--hint">Esc</kbd> to resume
        </p>
      )}
    </div>
  )
}
