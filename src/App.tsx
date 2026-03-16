import { useMemo } from 'react';
import '@/App.css';
import { puzzles } from '@/data';
import { Board, Keyboard } from '@/components';
import { useSudokuGame } from '@/hooks';

function App() {
  const puzzle = useMemo(
    () => puzzles[Math.floor(Math.random() * puzzles.length)],
    []
  );

  const game = useSudokuGame(puzzle);

  return (
    <div className="main">
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
        onKeyPress={game.assignValue}
      />
    </div>
  );
}

export default App;
