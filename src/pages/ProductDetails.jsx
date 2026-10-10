import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Heart } from 'lucide-react';
import products from '../data/products.json';
import { formatPrice } from '../utils/formatPrice';
import { showInterest } from '../utils/instagramUtils';
import ImageGallery from '../components/ImageGallery';

function ProductDetails() {
  const { id } = useParams();
  const product = products.find((item) => item.id === id);

  if (!product) {
    return (
      <section className="container section">
        <h1>Product not found</h1>
        <p>Sorry, we couldn't find that product.</p>
        <Link to="/products" className="btn btn-primary">
          <ArrowLeft size={17} /> Browse Collections
        </Link>
      </section>
    );
  }

  const handleInterest = async () => {
    const result = await showInterest(product);

    if (result.copied) {
      alert('Product details copied! Paste them into your Instagram DM.');
    } else {
      alert('Instagram opened. Send us a message about this product!');
    }
  };

  return (
    <section className="container section">
      <Link to="/products" className="back-link">
        <ArrowLeft size={16} /> Back to Collections
      </Link>

      <div className="product-details">
        <div className="product-details-image">
          <ImageGallery
            images={product.images}
            productName={product.name}
          />
        </div>

        <div className="product-details-info">
          <span className="eyebrow">{product.category}</span>
          <h1>{product.name}</h1>
          <p className="product-price">{formatPrice(product.price)}</p>
          <p>{product.description}</p>

          {product.available ? (
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleInterest}
            >
              <Heart size={17} /> Show Interest on Instagram
            </button>
          ) : (
            <p>This product is currently unavailable.</p>
          )}

          <p className="muted">
            Handmade with care. Message us on Instagram for customisation
            options and ordering details.
          </p>
        </div>
      </div>
    </section>
  );
}

export default ProductDetails;