
import React from 'react';
import { Quote } from '@/hooks/useQuotes';
import { Heart } from 'lucide-react';
import ShareButton from './ShareButton';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface QuoteCardProps {
  quote: Quote;
  onToggleFavorite: (quote: Quote) => void;
  onShare: (quote: Quote) => Promise<void>;
  isFavorite: boolean;
  isRefreshing?: boolean;
  className?: string;
}

const QuoteCard: React.FC<QuoteCardProps> = ({ 
  quote, 
  onToggleFavorite, 
  onShare, 
  isFavorite,
  isRefreshing = false,
  className
}) => {
  const handleToggleFavorite = () => {
    onToggleFavorite(quote);
  };

  const handleShare = async () => {
    await onShare(quote);
  };

  const cardVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.3 } }
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={cardVariants}
      className={cn(
        "quote-card bg-white/80 dark:bg-black/30 rounded-3xl p-7 md:p-10 flex flex-col shadow-lg relative overflow-hidden",
        isRefreshing ? "animate-pulse" : "animate-fade-in",
        className
      )}
    >
      <div className="absolute -right-8 -top-8 w-24 h-24 bg-primary/5 rounded-full blur-2xl" />
      <div className="absolute -left-8 -bottom-8 w-24 h-24 bg-primary/5 rounded-full blur-2xl" />
      
      <div className="relative z-10 flex-1 flex flex-col">
        <div className="mb-6">
          <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
            Quote of the Day
          </span>
        </div>

        <blockquote className="mb-6 flex-1">
          <p className="font-serif text-quote leading-tight font-medium tracking-tight text-foreground">
            "{quote.text}"
          </p>
        </blockquote>

        <footer className="mt-auto">
          <p className="text-muted-foreground font-medium">
            — {quote.author}
          </p>
          {quote.source && (
            <p className="text-sm text-muted-foreground/70 mt-1">
              {quote.source}
            </p>
          )}
        </footer>

        <div className="flex items-center justify-between mt-8">
          <button
            onClick={handleToggleFavorite}
            className={cn(
              "flex items-center justify-center p-3 rounded-full transition-all",
              isFavorite 
                ? "bg-pink-100 text-pink-500 hover:bg-pink-200" 
                : "bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80"
            )}
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart 
              size={18} 
              className={isFavorite ? "fill-current" : ""}
            />
          </button>
          
          <ShareButton onShare={handleShare} />
        </div>
      </div>
    </motion.div>
  );
};

export default QuoteCard;
