import { useCallback, useMemo, useState } from 'react'

import '@/App.css'

import { BoardPanel, EndgameOverlay, GameHeader, GameLayout, GameToolbar, Keyboard } from '@/components'
import { puzzles } from '@/data'
import { useSudokuGame, useTheme } from '@/hooks'

import type { Difficulty } from '@/types'

import { getPuzzlesForDifficulty } from '@/utils'

function App() {
  const [puzzleKey, setPuzzleKey] = useState(0)
  const [difficulty, setDifficulty] = useState<Difficulty>('medium')
  const puzzle = useMemo(() => {
    const pool = getPuzzlesForDifficulty(puzzles, difficulty)
    const list = pool.length > 0 ? pool : puzzles
    return list[Math.floor(Math.random() * list.length)]
  }, [puzzleKey, difficulty])
  const game = useSudokuGame(puzzle)
  const { theme, toggleTheme } = useTheme()
  const loadNewPuzzle = () => setPuzzleKey((previousKey) => previousKey + 1)
  const onDifficultyChange = useCallback((next: Difficulty) => {
    setDifficulty(next)
    setPuzzleKey((previousKey) => previousKey + 1)
  }, [])
  const endgameVariant = game.gameOver ? 'loss' : game.gameWon ? 'victory' : null
  const boardProps = {
    getCellValue: game.getCellValue,
    getCellValidation: game.getCellValidation,
    isCross: game.isCross,
    isBlock: game.isBlock,
    isSelected: game.isSelected,
    isHintFlash: game.isHintFlash,
    onSelectCell: game.selectCell,
  }
  return (
    <GameLayout>
      <div className="game-play">
        <div className="game-board-stack">
          <GameHeader
            theme={theme}
            onToggleTheme={toggleTheme}
            difficulty={difficulty}
            onDifficultyChange={onDifficultyChange}
            elapsedSeconds={game.elapsedSeconds}
            timerStopped={game.timerStopped}
            gameOver={game.gameOver}
            gameWon={game.gameWon}
            onToggleTimer={game.toggleTimer}
          />
          <BoardPanel
            board={boardProps}
            showPauseOverlay={game.timerStopped && !game.gameOver && !game.gameWon}
          />
        </div>
        <aside className="game-controls">
          <GameToolbar
            mistakes={game.mistakes}
            hintsRemaining={game.hintsRemaining}
            onHint={game.applyHint}
            hintDisabled={game.isHintDisabled()}
            onUndo={game.undoLastMove}
            undoDisabled={game.isUndoDisabled()}
            onNewGame={loadNewPuzzle}
          />
          <Keyboard
            disabled={game.isKeyboardDisabled()}
            eraseDisabled={game.isEraseDisabled()}
            onKeyPress={game.assignValue}
            onErase={game.eraseValue}
          />
        </aside>
      </div>
      <EndgameOverlay variant={endgameVariant} elapsedSeconds={game.elapsedSeconds} onNewGame={loadNewPuzzle} />
    </GameLayout>
  )
}

export default App
