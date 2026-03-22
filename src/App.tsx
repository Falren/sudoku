import { useCallback, useMemo, useState } from 'react'

import '@/App.css'

import { BoardPanel, EndgameOverlay, GameHeader, GameLayout, Keyboard } from '@/components'
import { puzzles } from '@/data'
import { useSudokuGame } from '@/hooks'

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
  const loadNewPuzzle = () => setPuzzleKey((k) => k + 1)
  const onDifficultyChange = useCallback((next: Difficulty) => {
    setDifficulty(next)
    setPuzzleKey((k) => k + 1)
  }, [])
  const endgameVariant = game.gameOver ? 'gameOver' : game.won ? 'win' : null
  const boardProps = {
    getCellValue: game.getCellValue,
    getCellValidation: game.getCellValidation,
    isCross: game.isCross,
    isBlock: game.isBlock,
    isSelected: game.isSelected,
    onSelectCell: game.selectCell,
  }
  return (
    <GameLayout>
      <GameHeader
        difficulty={difficulty}
        mistakes={game.mistakes}
        elapsedSeconds={game.elapsedSeconds}
        timerStopped={game.timerStopped}
        gameOver={game.gameOver}
        won={game.won}
        onDifficultyChange={onDifficultyChange}
        onNewGame={loadNewPuzzle}
        onToggleTimer={game.toggleTimer}
      />
      <BoardPanel
        board={boardProps}
        showPauseOverlay={game.timerStopped && !game.gameOver && !game.won}
      />
      <Keyboard
        disabled={game.isKeyboardDisabled()}
        eraseDisabled={game.isEraseDisabled()}
        onKeyPress={game.assignValue}
        onErase={game.eraseValue}
      />
      <EndgameOverlay variant={endgameVariant} elapsedSeconds={game.elapsedSeconds} onNewGame={loadNewPuzzle} />
    </GameLayout>
  )
}

export default App
