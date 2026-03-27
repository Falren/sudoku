import './HintSquareRipples.css'

const RING_COUNT = 8

export function HintSquareRipples() {
  return (
    <svg className="hint-square-svg" viewBox="0 0 100 100" aria-hidden>
      {Array.from({ length: RING_COUNT }, (_ignored, ringIndex) => (
        <g
          key={ringIndex}
          transform="translate(50 50)"
          className={`hint-square-layer hint-square-layer--${ringIndex % 2}`}
        >
          <g
            className="hint-square-anim"
            style={{
              animationDelay: `${-(ringIndex * 0.14) - (ringIndex % 2) * 1.5}s`,
            }}
          >
            <rect
              x="-5.5"
              y="-5.5"
              width="11"
              height="11"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.25"
              vectorEffect="non-scaling-stroke"
            />
          </g>
        </g>
      ))}
    </svg>
  )
}
