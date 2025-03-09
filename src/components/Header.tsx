
import { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Home, BookMarked, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HeaderProps {
  onRefresh?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onRefresh }) => {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleRefresh = () => {
    if (!onRefresh || isRefreshing) return;

    setIsRefreshing(true);
    onRefresh();

    // Reset the refreshing state after animation completes
    setTimeout(() => setIsRefreshing(false), 750);
  };

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 px-6 py-3 transition-all duration-300 backdrop-blur-md",
        isScrolled ? "bg-background/80 shadow-sm" : "bg-transparent"
      )}
    >
      <div className="container max-w-5xl mx-auto flex items-center justify-between">
        <h1 className="font-serif text-xl font-medium tracking-tight">
          <span className="text-primary">Quote</span>of<span className="text-foreground/70">Day</span>
        </h1>
        
        <div className="flex items-center space-x-2">
          {location.pathname === '/' && onRefresh && (
            <button 
              onClick={handleRefresh}
              className={cn(
                "p-2 rounded-full bg-primary/10 text-primary transition-all hover:bg-primary/20",
                isRefreshing && "animate-spin"
              )}
              aria-label="Get new quote"
            >
              <RefreshCw size={18} className={cn(isRefreshing && "opacity-70")} />
            </button>
          )}
          
          <nav className="flex items-center bg-secondary/80 backdrop-blur-md rounded-full p-1 shadow-sm">
            <Link
              to="/"
              className={cn(
                "p-2 rounded-full transition-all",
                location.pathname === '/' 
                  ? "bg-white text-primary shadow-sm" 
                  : "text-muted-foreground hover:text-foreground"
              )}
              aria-label="Home"
            >
              <Home size={18} />
            </Link>
            <Link
              to="/favorites"
              className={cn(
                "p-2 rounded-full transition-all",
                location.pathname === '/favorites' 
                  ? "bg-white text-primary shadow-sm" 
                  : "text-muted-foreground hover:text-foreground"
              )}
              aria-label="Favorites"
            >
              <BookMarked size={18} />
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
