import { useEffect } from 'react'
import { ERASE_KEY, NOTES_TOGGLE_KEY } from '@/constants'

interface SudokuHandlers {
  assignValue: (value: number) => void
  eraseValue: () => void
  moveSelection: (deltaRow: number, deltaCol: number) => void
  isKeyboardDisabled: () => boolean
  isEraseDisabled: () => boolean
  undoLastMove: () => void
  isUndoDisabled: () => boolean
  toggleNotesMode: () => void
}

export function useSudokuKeyboard(handlersRef: React.RefObject<SudokuHandlers | null>) {
  useEffect(() => {
    function handleErase(handlers: SudokuHandlers) {
      if (!handlers.isEraseDisabled()) handlers.eraseValue()
    }
    const onKeyDown = (e: KeyboardEvent) => {
      const handlers = handlersRef.current
      if (!handlers) return

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault()
        if (!handlers.isUndoDisabled()) handlers.undoLastMove()
        return
      }

      if (e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        e.preventDefault()
        const deltas: Record<string, readonly [number, number]> = {
          ArrowUp: [-1, 0],
          ArrowDown: [1, 0],
          ArrowLeft: [0, -1],
          ArrowRight: [0, 1],
        }
        const d = deltas[e.key]
        handlers.moveSelection(d[0], d[1])
        return
      }

      if (e.key.toLowerCase() === NOTES_TOGGLE_KEY && !e.metaKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault()
        handlers.toggleNotesMode()
        return
      }

      if (e.metaKey || e.ctrlKey || e.altKey) return

      e.preventDefault()
      if (handlers.isKeyboardDisabled()) return

      const isEraseKey = e.key === ERASE_KEY
      const num = parseInt(e.key, 10)
      const isDigitKey = num >= 1 && num <= 9
      if (isEraseKey) return handleErase(handlers)
      if (isDigitKey) handlers.assignValue(num)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])
}
