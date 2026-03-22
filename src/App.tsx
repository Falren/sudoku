import { useCallback, useMemo, useState } from 'react'

import '@/App.css'

import { RefreshIcon } from '@/assets/icons'
import { Board, DifficultySelector, Keyboard, Timer } from '@/components'
import { MAX_MISTAKES } from '@/constants'
import { puzzles } from '@/data'
import { useSudokuGame } from '@/hooks'

import type { Difficulty } from '@/types'

import { formatElapsedSeconds, getPuzzlesForDifficulty } from '@/utils'

function App() {
  const [puzzleKey, setPuzzleKey] = useState(0)
  const [difficulty, setDifficulty] = useState<Difficulty>('medium')
  const puzzle = useMemo(() => {
    const pool = getPuzzlesForDifficulty(puzzles, difficulty)
    const list = pool.length > 0 ? pool : puzzles
    return list[Math.floor(Math.random() * list.length)]
  }, [puzzleKey, difficulty])
  const game = useSudokuGame(puzzle)
  const loadNewPuzzle = () => setPuzzleKey((k) => k + 1)
  const onDifficultyChange = useCallback((next: Difficulty) => {
    setDifficulty(next)
    setPuzzleKey((k) => k + 1)
  }, [])
  return (
    <div className="main">
      <div className="header">
        <Timer
          elapsedSeconds={game.elapsedSeconds}
          timerStopped={game.timerStopped}
          gameOver={game.gameOver}
          won={game.won}
          onToggleTimer={game.toggleTimer}
        />
        <div className="mistakes">Mistakes: {game.mistakes} / {MAX_MISTAKES}</div>
        <DifficultySelector value={difficulty} onChange={onDifficultyChange} />
        <button className="redo-button" onClick={loadNewPuzzle} title="New Game" aria-label="New Game">
          <RefreshIcon />
        </button>
      </div>
      <div className="board-shell">
        <Board
          getCellValue={game.getCellValue}
          getCellValidation={game.getCellValidation}
          isCross={game.isCross}
          isBlock={game.isBlock}
          isSelected={game.isSelected}
          onSelectCell={game.selectCell}
        />
        {game.timerStopped && !game.gameOver && !game.won && (
          <div className="board-pause-overlay" role="status" aria-live="polite">
            <span className="board-pause-caption">Pause</span>
          </div>
        )}
      </div>
      <Keyboard
        disabled={game.isKeyboardDisabled()}
        eraseDisabled={game.isEraseDisabled()}
        onKeyPress={game.assignValue}
        onErase={game.eraseValue}
      />
      {game.gameOver && (
        <div className="endgame-overlay">
          <div className="endgame-message">
            <div>Game Over</div>
            <button className="redo-button" onClick={loadNewPuzzle} title="New Game" aria-label="New Game">
              New Game
            </button>
          </div>
        </div>
      )}
      {game.won && !game.gameOver && (
        <div className="endgame-overlay">
          <div className="endgame-message endgame-message-win">
            <div>You solved it!</div>
            <div className="endgame-sub">Time {formatElapsedSeconds(game.elapsedSeconds)}</div>
            <button className="redo-button" onClick={loadNewPuzzle} title="New Game" aria-label="New Game">
              New Game
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App