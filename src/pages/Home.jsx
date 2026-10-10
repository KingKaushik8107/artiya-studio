import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Heart,
  Sparkles,
  Gift,
  Flower2,
  Palette,
  Camera,
} from 'lucide-react';

import products from '../data/products.json';
import ProductGrid from '../components/ProductGrid';

const INSTAGRAM_URL =
  'https://www.instagram.com/artiya._.studio/';

const categories = [
  {
    title: 'Handmade Keychains',
    description: 'Little keepsakes made personal.',
    icon: Gift,
    link: '/products?category=Keychains',
    number: '01',
  },
  {
    title: 'Handmade Tulips',
    description: 'Flowers that make moments special.',
    icon: Flower2,
    link: '/products?category=Tulips',
    number: '02',
  },
  {
    title: 'Custom Art',
    description: 'Your favourite memories, made into art.',
    icon: Palette,
    link: '/products?category=Custom%20Art',
    number: '03',
  },
];

function Home() {
  const featuredProducts = products
    .filter((product) => product.featured && product.available)
    .slice(0, 3);

  return (
    <div className="home-page">
      {/* Hero */}
      <section className="home-hero">
        <div className="container home-hero-inner">
          <div className="home-hero-content">
            <span className="eyebrow home-eyebrow">
              <Sparkles size={15} />
              THOUGHTFUL GIFTS, MADE WITH LOVE
            </span>

            <h1>
              Little things.
              <br />
              <span>Big feelings.</span>
            </h1>

            <p className="home-hero-description">
              Handmade treasures, personalised keepsakes, and
              meaningful art created to make your favourite
              people feel extra special.
            </p>

            <div className="home-hero-actions">
              <Link to="/products" className="btn btn-primary">
                Explore Collections
                <ArrowRight size={17} />
              </Link>

              <Link to="/custom-art" className="btn btn-outline">
                Discover Custom Art
              </Link>
            </div>

            <div className="home-hero-note">
              <Heart size={16} fill="currentColor" />
              <span>Made with love, just for you</span>
            </div>
          </div>

          <div className="home-hero-art" aria-label="Artiya Studio gifting illustration">
            <div className="hero-orbit hero-orbit-one" />
            <div className="hero-orbit hero-orbit-two" />

            <div className="hero-flower hero-flower-one">✿</div>
            <div className="hero-flower hero-flower-two">✿</div>
            <div className="hero-sparkle hero-sparkle-one">✧</div>
            <div className="hero-sparkle hero-sparkle-two">✦</div>

            <div className="hero-gift-card">
              <div className="hero-gift-icon">
                <Gift size={43} strokeWidth={1.25} />
              </div>

              <span className="hero-card-small">
                A LITTLE SOMETHING
              </span>

              <span className="hero-card-title">
                made with
                <br />
                love ♡
              </span>

              <span className="hero-card-bottom">
                ARTIYA STUDIO
              </span>
            </div>

            <div className="hero-floating-tag">
              <Heart size={15} fill="currentColor" />
              Thoughtfully handmade
            </div>
          </div>
        </div>

        <div className="home-hero-bottom">
          <span>HANDMADE</span>
          <span className="hero-bottom-dot">✦</span>
          <span>PERSONALISED</span>
          <span className="hero-bottom-dot">✦</span>
          <span>MADE WITH LOVE</span>
        </div>
      </section>

      {/* Categories */}
      <section className="container section home-categories">
        <div className="section-heading">
          <span className="eyebrow">A LITTLE SOMETHING FOR EVERYONE</span>
          <h2>Find your kind of lovely.</h2>
          <p>
            Whether it's a tiny surprise or a memory worth framing,
            there's something special waiting for you.
          </p>
        </div>

        <div className="home-category-grid">
          {categories.map((category) => {
            const CategoryIcon = category.icon;

            return (
              <Link
                to={category.link}
                className="home-category-card"
                key={category.number}
              >
                <span className="category-number">
                  {category.number}
                </span>

                <div className="category-icon">
                  <CategoryIcon size={28} strokeWidth={1.5} />
                </div>

                <h3>{category.title}</h3>
                <p>{category.description}</p>

                <span className="category-explore">
                  Explore <ArrowRight size={15} />
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Featured products */}
      <section className="home-featured-section">
        <div className="container section">
          <div className="home-featured-heading">
            <div className="section-heading">
              <span className="eyebrow">
                <Sparkles size={14} />
                THE LITTLE THINGS WE LOVE
              </span>

              <h2>Made to make them smile.</h2>

              <p>
                Discover some of our favourite handmade creations.
              </p>
            </div>

            <Link
              to="/products"
              className="home-view-all"
            >
              View all products <ArrowRight size={16} />
            </Link>
          </div>

          {featuredProducts.length > 0 ? (
            <ProductGrid products={featuredProducts} />
          ) : (
            <div className="empty-state">
              <h3>Something lovely is on its way.</h3>
              <p>Our featured collection will be updated soon.</p>
              <Link to="/products" className="btn btn-outline">
                Browse Collections
              </Link>
            </div>
          )}

          <div className="home-featured-bottom">
            <Heart size={17} />
            <span>Every piece has a little love in it.</span>
          </div>
        </div>
      </section>

      {/* Custom art promotion */}
      <section className="container section home-custom-section">
        <div className="home-custom-card">
          <div className="home-custom-decoration">
            <Palette size={62} strokeWidth={1} />
            <span>♡</span>
          </div>

          <div className="home-custom-content">
            <span className="eyebrow">YOUR MEMORIES, YOUR WAY</span>
            <h2>Some moments deserve to become art.</h2>
            <p>
              Turn your favourite people and precious memories
              into personalised artwork made especially for you.
            </p>

            <Link to="/custom-art" className="btn btn-primary">
              Create Something Personal
              <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </section>

      {/* Instagram CTA */}
      <section className="home-instagram-section">
        <div className="container home-instagram-content">
          <span className="eyebrow">
            A LITTLE LOVE ON YOUR FEED
          </span>

          <h2>Come say hello on Instagram.</h2>

          <p>
            Discover our creations, explore gifting ideas,
            and message us to find your perfect little something.
          </p>

          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
          >
            <Camera size={18} />
            Follow @artiya._.studio
            <ArrowRight size={16} />
          </a>
        </div>
      </section>
    </div>
  );
}

export default Home;