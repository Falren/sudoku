import type { ReactNode } from 'react'

export function GameLayout({ children }: { children: ReactNode }) {
  return <div className="main">{children}</div>
}
