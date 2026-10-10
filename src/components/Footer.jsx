
import { Camera, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

const INSTAGRAM_URL = 'https://www.instagram.com/artiya._.studio/';

function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-content">
        <div className="footer-brand">
          <Link to="/" className="brand">
            <span className="brand-name">artiya studio</span>
            <span className="brand-tagline">HANDMADE WITH LOVE</span>
          </Link>

          <p>
            Thoughtful little gifts and custom art,
            made to turn moments into memories.
          </p>
        </div>

        <div className="footer-links">
          <h3>Explore</h3>
          <Link to="/products">All Products</Link>
          <Link to="/custom-art">Custom Art</Link>
          <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">
            Contact Us
          </a>
        </div>

        <div className="footer-social">
          <h3>Stay Connected</h3>
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="footer-instagram"
          >
            <Camera size={19} />
            @artiya._.studio
          </a>
        </div>
      </div>

      <div className="container footer-bottom">
        <p>
          © {new Date().getFullYear()} Artiya Studio. Made with{' '}
          <Heart size={14} fill="currentColor" /> love.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
