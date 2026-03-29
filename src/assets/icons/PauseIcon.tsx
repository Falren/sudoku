interface PauseIconProps {
  className?: string
}

export function PauseIcon({ className }: PauseIconProps) {
  return (
    <svg
      className={className ? `icon ${className}` : 'icon'}
      fill="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <g transform="scale(1.5)">
        <path d="M6 3.5a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-1 0V4a.5.5 0 0 1 .5-.5m4 0a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-1 0V4a.5.5 0 0 1 .5-.5" />
      </g>
    </svg>
  )
}
