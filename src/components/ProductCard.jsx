
import { useState } from 'react';
import { ArrowUpRight, Heart, ImageOff } from 'lucide-react';
import { Link } from 'react-router-dom';

import { formatPrice } from '../utils/formatPrice';
import { getDirectImageUrl } from '../utils/imageUtils';
import { showInterest } from '../utils/instagramUtils';
import ProductImage from './ProductImage';

function ProductCard({ product }) {
  const [interestMessage, setInterestMessage] = useState('');
  const [imageFailed, setImageFailed] = useState(false);

  const firstImage = product.images?.find(Boolean);

  const preloadProductImage = () => {
    if (!firstImage) return;

    const imageUrl = getDirectImageUrl(firstImage);
    if (!imageUrl) return;

    const img = new Image();
    img.decoding = 'async';
    img.src = imageUrl;
  };
  const imageUrl = getDirectImageUrl(firstImage);

  const handleInterest = async () => {
    setInterestMessage('Opening Instagram and preparing your message...');

    const result = await showInterest(product);

    if (result.copied) {
      setInterestMessage(
        'Your enquiry has been copied! Paste it into your Instagram DM.'
      );
    } else {
      setInterestMessage(
        'Instagram has been opened. If copying failed, you can still ask us about this product.'
      );
    }
  };


  return (
    <article className="product-card">
      <Link
        to={`/products/${product.id}`}
        className="product-card-image"
        aria-label={`View ${product.name}`}
        onMouseEnter={preloadProductImage}
        onFocus={preloadProductImage}
      >
      <ProductImage
        src={firstImage}
        alt={product.name}
        fit="cover"
      />

        {product.featured && (
          <span className="product-badge">Featured</span>
        )}
      </Link>

      <div className="product-card-content">
        <span className="product-category">
          {product.category}
        </span>

        <Link to={`/products/${product.id}`} className="product-name-link">
          <h3>{product.name}</h3>
        </Link>

        <p className="product-description">
          {product.description}
        </p>

        <div className="product-card-bottom">
          <span className="product-price">
            {formatPrice(product.price)}
          </span>

          <button
            type="button"
            className="interest-button"
            onClick={handleInterest}
            disabled={!product.available}
          >
            {product.available ? (
              <>
                <Heart size={16} />
                <span>Show Interest</span>
                <ArrowUpRight size={15} />
              </>
            ) : (
              'Unavailable'
            )}
          </button>
        </div>

        {interestMessage && (
          <p className="interest-feedback" role="status">
            {interestMessage}
          </p>
        )}
      </div>
    </article>
  );
}

export default ProductCard;
