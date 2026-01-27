import { cn } from '@/lib/utils';

interface SkillChipProps {
  skill: string;
  variant?: 'default' | 'glow' | 'outline';
  className?: string;
}

export const SkillChip = ({ skill, variant = 'default', className }: SkillChipProps) => {
  const variants = {
    default: 'bg-primary/20 border-primary/30 text-foreground',
    glow: 'bg-primary/20 border-primary/50 text-foreground shadow-[0_0_15px_hsl(262,83%,58%/0.3)]',
    outline: 'bg-transparent border-cyan/50 text-cyan',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border transition-all duration-300 hover:scale-105',
        variants[variant],
        className
      )}
    >
      {skill}
    </span>
  );
};
