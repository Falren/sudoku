import { useCallback, useEffect, useId, useState } from 'react'

import type { Difficulty } from '@/types'
import type { Theme } from '@/hooks'

import { DifficultySelector } from './DifficultySelector.tsx'
import { ThemeToggle } from './ThemeToggle.tsx'
import { Timer } from './Timer.tsx'

import './GameHeader.css'

type GameHeaderProps = {
  theme: Theme
  onToggleTheme: () => void
  difficulty: Difficulty
  onDifficultyChange: (next: Difficulty) => void
  elapsedSeconds: number
  timerStopped: boolean
  gameOver: boolean
  gameWon: boolean
  onToggleTimer: () => void
}

export function GameHeader({
  theme,
  onToggleTheme,
  difficulty,
  onDifficultyChange,
  elapsedSeconds,
  timerStopped,
  gameOver,
  gameWon,
  onToggleTimer,
}: GameHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuTitleId = useId()
  const closeMenu = useCallback(() => setMenuOpen(false), [])
  const toggleMenu = useCallback(() => setMenuOpen((open) => !open), [])

  useEffect(() => {
    if (!menuOpen) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeMenu()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [menuOpen, closeMenu])

  const onDifficultyFromMenu = useCallback(
    (next: Difficulty) => {
      onDifficultyChange(next)
      closeMenu()
    },
    [onDifficultyChange, closeMenu],
  )

  return (
    <header className="game-header">
      <div className="game-header-left">
        <div className="game-header-slot game-header-slot--wide">
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />
        </div>
        <div className="game-header-slot game-header-slot--narrow">
          <button
            type="button"
            className="game-header-burger"
            onClick={toggleMenu}
            aria-expanded={menuOpen}
            aria-controls="game-header-menu"
            aria-haspopup="dialog"
            title="Menu"
          >
            <BurgerIcon />
          </button>
        </div>
      </div>
      <div className="game-header-center">
        <div className="game-header-slot game-header-slot--wide">
          <DifficultySelector value={difficulty} onChange={onDifficultyChange} />
        </div>
      </div>
      <div className="game-header-right">
        <Timer
          elapsedSeconds={elapsedSeconds}
          timerStopped={timerStopped}
          gameOver={gameOver}
          gameWon={gameWon}
          onToggleTimer={onToggleTimer}
        />
      </div>

      {menuOpen && (
        <>
          <button
            type="button"
            className="game-header-menu-backdrop"
            aria-label="Close menu"
            onClick={closeMenu}
          />
          <div
            className="game-header-menu-panel"
            id="game-header-menu"
            role="dialog"
            aria-modal="true"
            aria-labelledby={menuTitleId}
          >
            <div className="game-header-menu-header">
              <h2 id={menuTitleId} className="game-header-menu-title">
                Settings
              </h2>
              <button
                type="button"
                className="game-header-menu-close"
                onClick={closeMenu}
                aria-label="Close menu"
              >
                <CloseIcon />
              </button>
            </div>
            <div className="game-header-menu-block">
              <span className="game-header-menu-label">Theme</span>
              <ThemeToggle theme={theme} onToggle={onToggleTheme} />
            </div>
            <div className="game-header-menu-block">
              <span className="game-header-menu-label">Difficulty</span>
              <DifficultySelector value={difficulty} onChange={onDifficultyFromMenu} />
            </div>
          </div>
        </>
      )}
    </header>
  )
}

function CloseIcon() {
  return (
    <svg className="game-header-menu-close-icon" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M18 6L6 18M6 6l12 12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}

function BurgerIcon() {
  return (
    <svg className="game-header-burger-icon" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 6h16M4 12h16M4 18h16"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}
