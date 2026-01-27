interface ProgressRingProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  bgColor?: string;
  label?: string;
  sublabel?: string;
}

export const ProgressRing = ({
  progress,
  size = 120,
  strokeWidth = 8,
  color = 'hsl(262, 83%, 58%)',
  bgColor = 'hsl(222, 47%, 18%)',
  label,
  sublabel,
}: ProgressRingProps) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="progress-ring">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={bgColor}
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="drop-shadow-[0_0_8px_hsl(262,83%,58%)]"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {label && (
          <span className="text-2xl font-bold font-display gradient-text">
            {label}
          </span>
        )}
        {sublabel && (
          <span className="text-xs text-muted-foreground">{sublabel}</span>
        )}
      </div>
    </div>
  );
};
