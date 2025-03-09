
import Header from '@/components/Header';
import QuoteCard from '@/components/QuoteCard';
import AnimatedPage from '@/components/AnimatedPage';
import { useQuotes } from '@/hooks/useQuotes';
import { motion } from 'framer-motion';
import { BookMarked } from 'lucide-react';

const Favorites = () => {
  const { favorites, toggleFavorite, isFavorite, shareQuote } = useQuotes();

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <AnimatedPage>
      <div className="min-h-screen flex flex-col">
        <Header />
        
        <main className="flex-1 py-24 px-6">
          <div className="container max-w-5xl mx-auto">
            <h2 className="text-2xl font-serif font-medium mb-2">Your Favorites</h2>
            <p className="text-muted-foreground mb-8">Your collection of inspiring quotes</p>
            
            {favorites.length > 0 ? (
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
                variants={container}
                initial="hidden"
                animate="show"
              >
                {favorites.map(quote => (
                  <motion.div key={quote.id} variants={item}>
                    <QuoteCard
                      quote={quote}
                      onToggleFavorite={toggleFavorite}
                      onShare={shareQuote}
                      isFavorite={isFavorite(quote.id)}
                      className="h-full"
                    />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="bg-secondary/50 p-5 rounded-full mb-4">
                  <BookMarked className="h-8 w-8 text-primary/70" />
                </div>
                <h3 className="text-xl font-medium mb-2">No favorites yet</h3>
                <p className="text-muted-foreground max-w-md">
                  Add your favorite quotes by tapping the heart icon when you see a quote you love
                </p>
              </div>
            )}
          </div>
        </main>
        
        <footer className="py-4 text-center text-sm text-muted-foreground">
          <p>Your favorite quotes, saved in one place</p>
        </footer>
      </div>
    </AnimatedPage>
  );
};

export default Favorites;
