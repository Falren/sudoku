import '@/components/Keyboard.css'
import { SUDOKU_DIGITS } from '@/constants'

interface KeyboardProps {
  disabled: boolean
  eraseDisabled: boolean
  onKeyPress: (value: number) => void
  onErase: () => void
}

export function Keyboard({
  disabled,
  eraseDisabled,
  onKeyPress,
  onErase,
}: KeyboardProps) {
  return (
    <div className="keyboard">
      <div className="keyboard-dial">
        {SUDOKU_DIGITS.map((digit) => (
          <button
            key={digit}
            type="button"
            className="keyboard-digit"
            disabled={disabled}
            onClick={() => onKeyPress(digit)}
          >
            {digit}
          </button>
        ))}
      </div>
      <button
        type="button"
        className="keyboard-erase"
        disabled={eraseDisabled}
        onClick={onErase}
        title="Erase"
      >
        Erase
      </button>
    </div>
  )
}
