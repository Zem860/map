import { Link } from 'react-router-dom'
import { ShoppingCart, BookOpen } from 'lucide-react'
import { Button } from './ui/button'
import { useCartStore } from '@/store/cartStore'

const Navbar = () => {
    const cartCount = useCartStore().count
    return (
        <header className='sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
            <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
                <Link to="/" className='flex items-center gap-2'>
                    <BookOpen className='h-6 w-6 text-primary' />
                    <span className='text-xl font-serif font-bold text-foreground'>Books</span>
                </Link>
                <nav className='flex items-center gap-6 text-sm font-medium'>
                    <Link to="/" className="text-foreground hover:text-primary transition-colors">
                    </Link>
                    <Link to="/shop" className='text-foreground hover:text-primary transition-colors'>
                        Shop
                    </Link>
                    <Link to="/about" className='text-foreground hover:text-primary transition-colors'>
                        About
                    </Link>
                </nav>
                <div className='flex items-center gap-2'>
                    <Button variant={"ghost"} size={"icon"} className='relative'>
                        <ShoppingCart />
                        <span className='absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center'>{cartCount}</span>
                    </Button>
                </div>
            </div>
        </header>
    );
}

export default Navbar;