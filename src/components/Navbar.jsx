import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Camera, Menu, X } from 'lucide-react';

const INSTAGRAM_URL = 'https://www.instagram.com/artiya._.studio/';

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="site-header">
      <div className="container navbar">
        <Link to="/" className="brand" onClick={closeMenu}>
          <span className="brand-name">artiya studio</span>
          <span className="brand-tagline">HANDMADE WITH LOVE</span>
        </Link>

        <button
          className="menu-toggle"
          type="button"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={23} /> : <Menu size={23} />}
        </button>

        <nav className={`nav-links ${menuOpen ? 'nav-open' : ''}`}>
          <NavLink to="/" end onClick={closeMenu}>
            Home
          </NavLink>

          <NavLink to="/products" onClick={closeMenu}>
            Collections
          </NavLink>

          <NavLink to="/custom-art" onClick={closeMenu}>
            Custom Art
          </NavLink>

          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="nav-instagram"
            onClick={closeMenu}
          >
            <Camera size={17} />
            <span>Instagram</span>
          </a>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;