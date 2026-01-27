export const AnimatedBackground = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Main gradient background */}
      <div className="absolute inset-0 bg-gradient-main" />
      
      {/* Animated orbs */}
      <div className="absolute w-[800px] h-[800px] rounded-full opacity-30 -top-[400px] -right-[200px] bg-gradient-radial from-primary/30 to-transparent animate-float" />
      <div className="absolute w-[600px] h-[600px] rounded-full opacity-20 -bottom-[300px] -left-[100px] bg-gradient-radial from-cyan/30 to-transparent animate-float" style={{ animationDelay: '-5s' }} />
      <div className="absolute w-[400px] h-[400px] rounded-full opacity-15 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-radial from-purple-glow/20 to-transparent animate-float" style={{ animationDelay: '-10s' }} />
      
      {/* Grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(hsl(222_47%_15%/0.03)_1px,transparent_1px),linear-gradient(90deg,hsl(222_47%_15%/0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
      
      {/* Noise texture */}
      <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")' }} />
    </div>
  );
};
