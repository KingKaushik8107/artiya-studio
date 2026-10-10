import { useState } from 'react';
import { ChevronLeft, ChevronRight, ImageOff } from 'lucide-react';
import { getDirectImageUrl } from '../utils/imageUtils';
import ProductImage from './ProductImage';

function ImageGallery({ images = [], productName = 'Product' }) {
  const validImages = images
    .filter(Boolean)
    .map(getDirectImageUrl)
    .filter(Boolean);

  const [activeIndex, setActiveIndex] = useState(0);
  const [failedImages, setFailedImages] = useState([]);

  const currentImage = validImages[activeIndex];
  const hasMultipleImages = validImages.length > 1;
  const currentImageFailed = failedImages.includes(currentImage);

  const markImageFailed = (url) => {
    setFailedImages((previous) =>
      previous.includes(url) ? previous : [...previous, url]
    );
  };

  const showPrevious = () => {
    setActiveIndex((index) =>
      index === 0 ? validImages.length - 1 : index - 1
    );
  };

  const showNext = () => {
    setActiveIndex((index) =>
      index === validImages.length - 1 ? 0 : index + 1
    );
  };

  return (
    <div className="image-gallery">
      <div className="gallery-main">

        <ProductImage
          src={currentImage}
          alt={`${productName} - image ${activeIndex + 1}`}
          fit="contain"
          className="gallery-smart-image"
          loading="eager"
        />

        {hasMultipleImages && (
          <>
            <button
              type="button"
              className="gallery-arrow gallery-arrow-left"
              onClick={showPrevious}
              aria-label="Previous image"
            >
              <ChevronLeft size={22} />
            </button>

            <button
              type="button"
              className="gallery-arrow gallery-arrow-right"
              onClick={showNext}
              aria-label="Next image"
            >
              <ChevronRight size={22} />
            </button>

            <span className="gallery-counter">
              {activeIndex + 1} / {validImages.length}
            </span>
          </>
        )}
      </div>

      {hasMultipleImages && (
        <div className="gallery-thumbnails">
          {validImages.map((image, index) => (
            <button
              type="button"
              key={`${image}-${index}`}
              className={`gallery-thumbnail ${
                activeIndex === index ? 'active' : ''
              }`}
              onClick={() => setActiveIndex(index)}
              aria-label={`View image ${index + 1}`}
              aria-pressed={activeIndex === index}
            >
              {failedImages.includes(image) ? (
                <ImageOff size={20} />
              ) : (
                <img
                  src={image}
                  alt={`${productName} thumbnail ${index + 1}`}
                  onError={() => markImageFailed(image)}
                />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default ImageGallery;