import { useMemo, useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

import products from '../data/products.json';
import ProductFilter from '../components/ProductFilter';
import ProductGrid from '../components/ProductGrid';

const INITIAL_FILTERS = {
  search: '',
  category: 'all',
  minPrice: '',
  maxPrice: '',
  sort: 'featured',
};

const VALID_CATEGORIES = ['Keychains', 'Tulips', 'Custom Art'];

function Products() {
  const [searchParams] = useSearchParams();

  const categoryFromUrl = searchParams.get('category');

  const initialCategory = VALID_CATEGORIES.includes(categoryFromUrl)
    ? categoryFromUrl
    : 'all';

  const [filters, setFilters] = useState(() => ({
    ...INITIAL_FILTERS,
    category: initialCategory,
  }));

  // Update the category when the URL changes.
  useEffect(() => {
    const category = searchParams.get('category');

    const validCategory = VALID_CATEGORIES.includes(category)
      ? category
      : 'all';

    setFilters((previous) => ({
      ...previous,
      category: validCategory,
    }));
  }, [searchParams]);

  const filteredProducts = useMemo(() => {
    const searchTerm = filters.search.trim().toLowerCase();

    const result = products.filter((product) => {
      const searchableText = [
        product.name,
        product.description,
        product.category,
        ...(product.tags || []),
      ]
        .join(' ')
        .toLowerCase();

      const matchesSearch = searchableText.includes(searchTerm);

      const matchesCategory =
        filters.category === 'all' ||
        product.category === filters.category;

      const minPrice =
        filters.minPrice === '' ? null : Number(filters.minPrice);

      const maxPrice =
        filters.maxPrice === '' ? null : Number(filters.maxPrice);

      const matchesMinPrice =
        minPrice === null ||
        (Number.isFinite(minPrice) && product.price >= minPrice);

      const matchesMaxPrice =
        maxPrice === null ||
        (Number.isFinite(maxPrice) && product.price <= maxPrice);

      return (
        product.available &&
        matchesSearch &&
        matchesCategory &&
        matchesMinPrice &&
        matchesMaxPrice
      );
    });

    switch (filters.sort) {
      case 'newest':
        result.sort((a, b) =>
          (b.createdAt || '').localeCompare(a.createdAt || '')
        );
        break;

      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;

      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;

      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;

      case 'featured':
      default:
        result.sort(
          (a, b) => Number(b.featured) - Number(a.featured)
        );
        break;
    }

    return result;
  }, [filters]);

  return (
    <div className="products-page">
      <section className="products-hero">
        <div className="container products-hero-content">
          <span className="eyebrow">
            <Sparkles size={14} />
            THE ARTIYA COLLECTION
          </span>

          <h1>Little things, made meaningful.</h1>

          <p>
            Discover thoughtful gifts, handmade tulips, and
            personalized artwork created to celebrate your
            favourite people and moments.
          </p>
        </div>
      </section>

      <section className="container section products-section">
        <div className="section-heading products-heading">
          <span className="eyebrow">MADE WITH LOVE</span>
          <h2>Explore our collection</h2>
          <p>Find something special for someone special.</p>
        </div>

        <ProductFilter
          filters={filters}
          onFilterChange={setFilters}
          resultCount={filteredProducts.length}
        />

        <ProductGrid products={filteredProducts} />
      </section>
    </div>
  );
}

export default Products;