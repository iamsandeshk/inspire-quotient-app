
import { Share } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface ShareButtonProps {
  onShare: () => Promise<void>;
  className?: string;
}

const ShareButton: React.FC<ShareButtonProps> = ({ onShare, className }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  
  const handleShare = async () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    await onShare();
    
    // Reset animation state after completion
    setTimeout(() => setIsAnimating(false), 750);
  };

  return (
    <button
      onClick={handleShare}
      className={cn(
        "flex items-center justify-center p-3 rounded-full bg-primary text-primary-foreground shadow-md transition-all hover:bg-primary/90 active:scale-95",
        isAnimating && "animate-pulse",
        className
      )}
      disabled={isAnimating}
      aria-label="Share quote"
    >
      <Share size={18} />
    </button>
  );
};

export default ShareButton;
