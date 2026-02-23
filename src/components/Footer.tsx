import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t py-12 bg-background mt-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">

          {/* 左側：品牌名稱與簡單介紹 */}
          <div className="space-y-4">
            <h2 className="font-serif font-bold text-xl tracking-tight text-primary">Books</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Find peace in words, meet yourself in stories, and share your journey.<br />
              **Curated titles with free shipping on every story.**
            </p>
          </div>

          {/* 中間：導覽連結 */}
          <div className="flex flex-col space-y-4">
            <h3 className="font-semibold text-sm uppercase tracking-wider">Quick Navigation</h3>
            <nav className="flex flex-col space-y-2 text-sm text-muted-foreground">
              <Link to="/shop" className="hover:text-primary transition-colors">Products</Link>
              <Link to="/articles" className="hover:text-primary transition-colors">Articles</Link>
              <Link to="/about" className="hover:text-primary transition-colors">About Us</Link>
            </nav>
          </div>

          {/* 右側：聯繫方式 */}
          <div className="flex flex-col space-y-4">
            <h3 className="font-semibold text-sm uppercase tracking-wider">Contact Us</h3>
            <div className="text-sm text-muted-foreground space-y-2">
              <p>Email: hello@books.com</p>
              <div className="flex justify-center md:justify-start space-x-4 pt-2">
                <a href="#" className="hover:text-primary">Instagram</a>
                <a href="#" className="hover:text-primary">Facebook</a>
              </div>
            </div>
          </div>

        </div>

        {/* 底部一條線與版權 */}
        <div className="border-t mt-10 pt-6 text-center text-xs text-muted-foreground">
          <p>© {currentYear} Books. Enjoy Reading.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;