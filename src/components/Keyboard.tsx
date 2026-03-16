import { SUDOKU_DIGITS } from '@/constants';

interface KeyboardProps {
  disabled: boolean;
  onKeyPress: (value: number) => void;
}

export function Keyboard({ disabled, onKeyPress }: KeyboardProps) {
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
    </div>
  );
}
