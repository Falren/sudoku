import '@/components/DifficultySelector.css'
import type { Difficulty } from '@/types'

const OPTIONS: { value: Difficulty; label: string }[] = [
  { value: 'easy', label: 'Easy' },
  { value: 'medium', label: 'Medium' },
  { value: 'hard', label: 'Hard' },
]

interface DifficultySelectorProps {
  value: Difficulty
  onChange: (difficulty: Difficulty) => void
}

export function DifficultySelector({ value, onChange }: DifficultySelectorProps) {
  return (
    <div className="difficulty" role="group">
      {OPTIONS.map(({ value: optionValue, label }) => (
        <button
          key={optionValue}
          type="button"
          className={`difficulty-option${value === optionValue ? ' active' : ''}`}
          onClick={() => onChange(optionValue)}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
