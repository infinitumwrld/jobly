import React, { useEffect, useRef, useState } from 'react';

interface ProgressRingProps {
  /** Progress value (0–100) */
  value: number
  /** Diameter in pixels – default 44 */
  size?: number
}

/**
 * Simple SVG circular progress indicator.
 * It is intentionally tiny and dependency-free so it can be used anywhere.
 */
const ProgressRing = ({ value, size = 44 }: ProgressRingProps) => {
  const stroke = 4;
  const thinStroke = 1.5;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const [animatedValue, setAnimatedValue] = useState(0);
  const prevValue = useRef(0);

  useEffect(() => {
    let start: number | null = null;
    const duration = 700;
    const animate = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const newValue = prevValue.current + (value - prevValue.current) * progress;
      setAnimatedValue(newValue);
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        prevValue.current = value;
      }
    };
    requestAnimationFrame(animate);
    // eslint-disable-next-line
  }, [value]);

  const progress = Math.max(0, Math.min(100, animatedValue));
  const offset = circumference - (progress / 100) * circumference;

  // For the faint outer ring
  const outerRadius = (size - thinStroke) / 2 + 2;
  const outerCircumference = 2 * Math.PI * outerRadius;

  return (
    <div className="flex flex-col items-center justify-center" style={{ width: size }}>
      <span className="mb-1 text-xs font-semibold text-white drop-shadow-sm">Score</span>
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg width={size + 6} height={size + 6} className="relative z-10" style={{ overflow: 'visible' }}>
          {/* Thin, faint outer ring */}
          <circle
            cx={(size + 6) / 2}
            cy={(size + 6) / 2}
            r={outerRadius}
            stroke="rgba(255,255,255,0.08)"
            strokeWidth={thinStroke}
            fill="none"
          />
          {/* Subtle, thin background track */}
          <circle
            cx={(size + 6) / 2}
            cy={(size + 6) / 2}
            r={radius}
            stroke="rgba(255,255,255,0.18)"
            strokeWidth={stroke}
            fill="none"
          />
          {/* Progress arc with glow */}
          <circle
            cx={(size + 6) / 2}
            cy={(size + 6) / 2}
            r={radius}
            stroke="url(#progress-gradient)"
            strokeWidth={stroke}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={progress === 100 ? 0.01 : offset}
            strokeLinecap="round"
            style={{ filter: 'drop-shadow(0 0 8px #fff)' }}
          />
          <defs>
            <linearGradient id="progress-gradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#fff" />
              <stop offset="100%" stopColor="#e5e7eb" />
            </linearGradient>
          </defs>
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-white font-extrabold text-base drop-shadow-md select-none z-20">
          {Math.round(progress)}
        </span>
      </div>
    </div>
  )
}

export default ProgressRing 