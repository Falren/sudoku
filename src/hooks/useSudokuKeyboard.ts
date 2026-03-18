import { useEffect } from 'react'
import { ERASE_KEY } from '@/constants'

interface SudokuHandlers {
  assignValue: (value: number) => void
  eraseValue: () => void
  isKeyboardDisabled: () => boolean
  isEraseDisabled: () => boolean
}

export function useSudokuKeyboard(handlersRef: React.RefObject<SudokuHandlers>) {
  useEffect(() => {
    function handleErase(handlers: SudokuHandlers) {
      if (!handlers.isEraseDisabled()) handlers.eraseValue()
    }
    const onKeyDown = (e: KeyboardEvent) => {
      e.preventDefault()

      const handlers = handlersRef.current
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
