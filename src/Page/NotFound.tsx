import { Home, BookOpen, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
const NotFound = () => {
  return (
    <main className="flex-1 flex items-center justify-center px-4 py-16">
      <div className="max-w-2xl mx-auto text-center">
        {/* Large 404 */}
        <div className="mb-8">
          <span className="font-serif text-[150px] md:text-[200px] font-bold text-primary/10 leading-none select-none">
            404
          </span>
        </div>

        {/* Title */}
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
          Page Not Found
        </h1>

        {/* Literary quote */}
        <div className="mb-8">
          <blockquote className="text-lg md:text-xl text-muted-foreground italic leading-relaxed mb-3">
            "Not all those who wander are lost."
          </blockquote>
          <cite className="text-sm text-muted-foreground">
            — J.R.R. Tolkien, The Fellowship of the Ring
          </cite>
        </div>

        {/* Description */}
        <p className="text-muted-foreground mb-10 max-w-md mx-auto leading-relaxed">
          The page you are looking for seems to have wandered off into another
          chapter. Let us help you find your way back to the story.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <Link to="/">
            <Button size="lg" className="min-w-[180px]">
              <Home className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <Link to="/shop">
            <Button
              variant="outline"
              size="lg"
              className="min-w-[180px] bg-transparent"
            >
              <BookOpen className="h-4 w-4 mr-2" />
              Browse Books
            </Button>
          </Link>
        </div>

        {/* Quick Links */}
        <div className="border-t border-border pt-8">
          <p className="text-sm text-muted-foreground mb-4">
            Or try one of these:
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm">
            <Link
              to="/articles"
              className="text-primary hover:underline underline-offset-4 inline-flex items-center gap-1"
            >
              <ArrowLeft className="h-3 w-3" />
              Articles
            </Link>
            <Link
              to="/shop"
              className="text-primary hover:underline underline-offset-4 inline-flex items-center gap-1"
            >
              <ArrowLeft className="h-3 w-3" />
              Shop
            </Link>
            <Link
              to="/cart"
              className="text-primary hover:underline underline-offset-4 inline-flex items-center gap-1"
            >
              <ArrowLeft className="h-3 w-3" />
              Cart
            </Link>
            <Link
              to="/about"
              className="text-primary hover:underline underline-offset-4 inline-flex items-center gap-1"
            >
              <ArrowLeft className="h-3 w-3" />
              About
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
};

export default NotFound;
