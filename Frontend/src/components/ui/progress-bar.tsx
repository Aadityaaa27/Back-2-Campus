interface ProgressBarProps {
  progress: number;
  label?: string;
  sublabel?: string;
  color?: 'purple' | 'cyan' | 'gradient';
  size?: 'sm' | 'md' | 'lg';
  showPercentage?: boolean;
  animated?: boolean;
}

export const ProgressBar = ({
  progress,
  label,
  sublabel,
  color = 'gradient',
  size = 'md',
  showPercentage = true,
  animated = true,
}: ProgressBarProps) => {
  const heights = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4',
  };

  const colors = {
    purple: 'bg-primary',
    cyan: 'bg-cyan',
    gradient: 'bg-gradient-to-r from-primary to-cyan',
  };

  return (
    <div className="w-full">
      {(label || showPercentage) && (
        <div className="flex justify-between items-center mb-2">
          <div>
            {label && <span className="text-sm font-medium text-foreground">{label}</span>}
            {sublabel && <span className="text-xs text-muted-foreground ml-2">{sublabel}</span>}
          </div>
          {showPercentage && (
            <span className="text-sm font-bold gradient-text">{Math.round(progress)}%</span>
          )}
        </div>
      )}
      <div className={`w-full ${heights[size]} bg-secondary rounded-full overflow-hidden`}>
        <div
          className={`${heights[size]} ${colors[color]} rounded-full transition-all duration-1000 ease-out ${animated ? 'shadow-lg shadow-primary/30' : ''}`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};
