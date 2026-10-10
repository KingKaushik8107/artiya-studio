import { useEffect, useRef, useState } from 'react';
import { ImageOff } from 'lucide-react';
import { getDirectImageUrl } from '../utils/imageUtils';

function ProductImage({
  src,
  alt = 'Product image',
  className = '',
  fit = 'cover',
  loading = 'lazy',
}) {
  const imageUrl = getDirectImageUrl(src);
  const imageRef = useRef(null);

  const [isLoading, setIsLoading] = useState(Boolean(imageUrl));
  const [hasError, setHasError] = useState(!imageUrl);

  useEffect(() => {
    setIsLoading(Boolean(imageUrl));
    setHasError(!imageUrl);

    // Handle images that were already loaded from browser cache.
    const image = imageRef.current;

    if (image?.complete) {
      if (image.naturalWidth > 0) {
        setIsLoading(false);
        setHasError(false);
      } else if (imageUrl) {
        setIsLoading(false);
        setHasError(true);
      }
    }
  }, [imageUrl]);

  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  return (
    <div
      className={`smart-image ${className}`}
      data-fit={fit}
    >
      {imageUrl && (
        <img
          ref={imageRef}
          key={imageUrl}
          src={imageUrl}
          alt={alt}
          loading={loading}
          decoding="async"
          fetchPriority={loading === 'eager' ? 'high' : 'auto'}
          onLoad={handleLoad}
          onError={handleError}
        />
      )}

      {isLoading && !hasError && (
        <div className="smart-image-loading" aria-label="Loading image">
          <span className="image-spinner" />
        </div>
      )}

      {hasError && (
        <div className="smart-image-fallback" role="img" aria-label={alt}>
          <ImageOff size={30} strokeWidth={1.4} />
          <span>Image unavailable</span>
        </div>
      )}
    </div>
  );
}

export default ProductImage;