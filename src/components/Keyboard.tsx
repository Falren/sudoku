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
      {SUDOKU_DIGITS.map((key) => (
        <button
          key={key}
          disabled={disabled}
          onClick={() => onKeyPress(key)}
        >
          {key}
        </button>
      ))}
      <button
        className="keyboard-erase"
        disabled={eraseDisabled}
        onClick={onErase}
        title="Erase"
        aria-label="Erase"
      >
        Erase
      </button>
    </div>
  )
}
