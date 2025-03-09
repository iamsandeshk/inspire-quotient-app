
import { useState } from 'react';
import Header from '@/components/Header';
import QuoteCard from '@/components/QuoteCard';
import AnimatedPage from '@/components/AnimatedPage';
import { useQuotes } from '@/hooks/useQuotes';
import { motion } from 'framer-motion';

const Index = () => {
  const { currentQuote, loading, getNewQuote, toggleFavorite, isFavorite, shareQuote } = useQuotes();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    getNewQuote();
    
    // Reset the refreshing state after animation completes
    setTimeout(() => setIsRefreshing(false), 300);
  };

  return (
    <AnimatedPage>
      <div className="min-h-screen flex flex-col">
        <Header onRefresh={handleRefresh} />
        
        <main className="flex-1 flex items-center justify-center p-6 pt-24 pb-16">
          <div className="w-full max-w-xl mx-auto">
            {loading ? (
              <div className="animate-pulse quote-card bg-white/80 dark:bg-black/20 rounded-3xl p-8 flex flex-col h-96 shadow-lg">
                <div className="h-3 bg-secondary/70 rounded w-1/4 mb-8"></div>
                <div className="h-6 bg-secondary/70 rounded w-11/12 mb-3"></div>
                <div className="h-6 bg-secondary/70 rounded w-10/12 mb-3"></div>
                <div className="h-6 bg-secondary/70 rounded w-8/12 mb-6"></div>
                <div className="h-4 bg-secondary/70 rounded w-1/3 mt-auto"></div>
                <div className="flex justify-between mt-6">
                  <div className="h-10 w-10 bg-secondary/70 rounded-full"></div>
                  <div className="h-10 w-10 bg-secondary/70 rounded-full"></div>
                </div>
              </div>
            ) : currentQuote ? (
              <QuoteCard
                quote={currentQuote}
                onToggleFavorite={toggleFavorite}
                onShare={shareQuote}
                isFavorite={isFavorite(currentQuote.id)}
                isRefreshing={isRefreshing}
              />
            ) : (
              <div className="text-center py-12">
                <p>No quote available. Try refreshing.</p>
              </div>
            )}
          </div>
        </main>
        
        <footer className="py-4 text-center text-sm text-muted-foreground">
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            A new inspiring quote every day
          </motion.p>
        </footer>
      </div>
    </AnimatedPage>
  );
};

export default Index;
