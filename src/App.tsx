import { useState, useMemo } from 'react'
import '@/App.css'
import { puzzles } from '@/data'
import { Board, Keyboard } from '@/components'
import { useSudokuGame } from '@/hooks'
import { MAX_MISTAKES } from '@/constants'
import { RefreshIcon } from '@/assets/icons'
function App() {
  const [puzzleKey, setPuzzleKey] = useState(0)
  const puzzle = useMemo(
    () => puzzles[Math.floor(Math.random() * puzzles.length)],
    [puzzleKey]
  )
  const game = useSudokuGame(puzzle)
  const loadNewPuzzle = () => setPuzzleKey((k) => k + 1)
  return (
    <div className="main">
      <div className="header">
        <div className="mistakes">Mistakes: {game.mistakes} / {MAX_MISTAKES}</div>
        <button className="redo-button" onClick={loadNewPuzzle} title="New Game" aria-label="New Game">
          <RefreshIcon />
        </button>
      </div>
      <Board
        getCellValue={game.getCellValue}
        getCellValidation={game.getCellValidation}
        isCross={game.isCross}
        isBlock={game.isBlock}
        isSelected={game.isSelected}
        onSelectCell={game.selectCell}
      />
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
    </div>
  )
}

export default App