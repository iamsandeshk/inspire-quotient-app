import { useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";

// Type definitions
export interface Quote {
  id: string;
  text: string;
  author: string;
  source?: string;
}

const QUOTES_STORAGE_KEY = 'daily-quotes-favorites';
const LAST_QUOTE_DATE_KEY = 'daily-quotes-last-date';
const CURRENT_QUOTE_KEY = 'daily-quotes-current';

// Sample quotes data
const sampleQuotes: Quote[] = [
  {
    id: '1',
    text: "The only way to do great work is to love what you do.",
    author: "Steve Jobs"
  },
  {
    id: '2',
    text: "Design is not just what it looks like and feels like. Design is how it works.",
    author: "Steve Jobs"
  },
  {
    id: '3',
    text: "Less, but better.",
    author: "Dieter Rams"
  },
  {
    id: '4',
    text: "Simplicity is the ultimate sophistication.",
    author: "Leonardo da Vinci"
  },
  {
    id: '5',
    text: "Good design is as little design as possible.",
    author: "Dieter Rams"
  },
  {
    id: '6',
    text: "Innovation distinguishes between a leader and a follower.",
    author: "Steve Jobs"
  },
  {
    id: '7',
    text: "The details are not the details. They make the design.",
    author: "Charles Eames"
  },
  {
    id: '8',
    text: "Design is intelligence made visible.",
    author: "Alina Wheeler"
  },
  {
    id: '9',
    text: "Stay hungry, stay foolish.",
    author: "Steve Jobs"
  },
  {
    id: '10',
    text: "Good design is obvious. Great design is transparent.",
    author: "Joe Sparano"
  },
  {
    id: '11',
    text: "Perfection is achieved not when there is nothing more to add, but when there is nothing left to take away.",
    author: "Antoine de Saint-Exupéry"
  },
  {
    id: '12',
    text: "Design is not for philosophy, it's for life.",
    author: "Issey Miyake"
  }
];

export const useQuotes = () => {
  const [currentQuote, setCurrentQuote] = useState<Quote | null>(null);
  const [favorites, setFavorites] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Load favorites from localStorage
  useEffect(() => {
    const loadFavorites = () => {
      try {
        const storedFavorites = localStorage.getItem(QUOTES_STORAGE_KEY);
        if (storedFavorites) {
          setFavorites(JSON.parse(storedFavorites));
        }
      } catch (error) {
        console.error('Error loading favorites:', error);
      }
    };

    loadFavorites();
  }, []);

  // Load or refresh current quote
  useEffect(() => {
    const loadCurrentQuote = () => {
      try {
        const lastDateStr = localStorage.getItem(LAST_QUOTE_DATE_KEY);
        const today = new Date().toDateString();
        
        // If it's a new day or no quote exists, get a new quote
        if (!lastDateStr || lastDateStr !== today) {
          getNewQuote();
          localStorage.setItem(LAST_QUOTE_DATE_KEY, today);
        } else {
          // Otherwise load the stored quote
          const storedQuote = localStorage.getItem(CURRENT_QUOTE_KEY);
          if (storedQuote) {
            setCurrentQuote(JSON.parse(storedQuote));
          } else {
            getNewQuote();
          }
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error loading current quote:', error);
        getNewQuote();
        setLoading(false);
      }
    };

    loadCurrentQuote();
  }, []);

  // Get a new random quote that's not in favorites
  const getNewQuote = () => {
    setLoading(true);
    
    // Filter out quotes that are already in favorites
    const favoriteIds = favorites.map(fav => fav.id);
    const availableQuotes = sampleQuotes.filter(quote => !favoriteIds.includes(quote.id));
    
    // If all quotes are in favorites or no quotes available, use all quotes
    const quotesToSelectFrom = availableQuotes.length > 0 ? availableQuotes : sampleQuotes;
    
    // Select a random quote that's different from current if possible
    let newQuote;
    if (quotesToSelectFrom.length > 1 && currentQuote) {
      let filteredQuotes = quotesToSelectFrom.filter(q => q.id !== currentQuote.id);
      if (filteredQuotes.length === 0) filteredQuotes = quotesToSelectFrom;
      newQuote = filteredQuotes[Math.floor(Math.random() * filteredQuotes.length)];
    } else {
      newQuote = quotesToSelectFrom[Math.floor(Math.random() * quotesToSelectFrom.length)];
    }
    
    setCurrentQuote(newQuote);
    localStorage.setItem(CURRENT_QUOTE_KEY, JSON.stringify(newQuote));
    setLoading(false);
    
    return newQuote;
  };

  // Toggle a quote as favorite
  const toggleFavorite = (quote: Quote) => {
    if (!quote) return;
    
    const isFavorite = favorites.some(fav => fav.id === quote.id);
    let newFavorites;
    
    if (isFavorite) {
      newFavorites = favorites.filter(fav => fav.id !== quote.id);
      toast({
        description: "Removed from favorites",
        duration: 2000,
      });
    } else {
      newFavorites = [...favorites, quote];
      toast({
        description: "Added to favorites",
        duration: 2000,
      });
    }
    
    setFavorites(newFavorites);
    localStorage.setItem(QUOTES_STORAGE_KEY, JSON.stringify(newFavorites));
  };

  // Check if a quote is in favorites
  const isFavorite = (quoteId: string) => {
    return favorites.some(fav => fav.id === quoteId);
  };

  // Share current quote
  const shareQuote = async (quote: Quote) => {
    if (!quote) return;
    
    const shareText = `"${quote.text}" — ${quote.author}`;
    
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Inspiring Quote',
          text: shareText,
        });
        toast({
          description: "Shared successfully",
          duration: 2000,
        });
      } else {
        // Fallback for browsers that don't support Web Share API
        navigator.clipboard.writeText(shareText);
        toast({
          description: "Quote copied to clipboard",
          duration: 2000,
        });
      }
    } catch (error) {
      console.error('Error sharing:', error);
      toast({
        variant: "destructive",
        description: "Unable to share quote",
        duration: 2000,
      });
    }
  };

  return {
    currentQuote,
    favorites,
    loading,
    getNewQuote,
    toggleFavorite,
    isFavorite,
    shareQuote
  };
};
