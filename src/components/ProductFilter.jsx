
import { useState } from 'react';
import { Filter, Search, X } from 'lucide-react';
import categories from '../data/categories';

function ProductFilter({ filters, onFilterChange, resultCount }) {
  const [showFilters, setShowFilters] = useState(false);

  const updateFilter = (key, value) => {
    onFilterChange({
      ...filters,
      [key]: value
    });
  };

  const resetFilters = () => {
    onFilterChange({
      search: '',
      category: 'all',
      minPrice: '',
      maxPrice: '',
      sort: 'featured'
    });
  };

  return (
    <section className="product-toolbar">
      <div className="product-toolbar-top">
        <div className="search-field">
          <Search size={18} aria-hidden="true" />
          <input
            type="search"
            placeholder="Search keychains, tulips, art..."
            aria-label="Search products"
            value={filters.search}
            onChange={(event) =>
              updateFilter('search', event.target.value)
            }
          />
          {filters.search && (
            <button
              type="button"
              className="clear-search"
              aria-label="Clear search"
              onClick={() => updateFilter('search', '')}
            >
              <X size={16} />
            </button>
          )}
        </div>

        <button
          type="button"
          className="filter-toggle"
          onClick={() => setShowFilters(!showFilters)}
          aria-expanded={showFilters}
        >
          <Filter size={17} />
          Filters
        </button>

        <label className="sort-field">
          <span>Sort by</span>
          <select
            value={filters.sort}
            onChange={(event) =>
              updateFilter('sort', event.target.value)
            }
          >
            <option value="featured">Featured</option>
            <option value="newest">Newest</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="name">Name: A–Z</option>
          </select>
        </label>
      </div>

      <div className="category-pills" aria-label="Product categories">
        {categories.map((category) => (
          <button
            type="button"
            key={category.id}
            className={
              filters.category === category.id
                ? 'category-pill active'
                : 'category-pill'
            }
            onClick={() => updateFilter('category', category.id)}
          >
            {category.label}
          </button>
        ))}
      </div>

      {showFilters && (
        <div className="advanced-filters">
          <div className="price-filter">
            <label>
              Minimum price (₹)
              <input
                type="number"
                min="0"
                placeholder="0"
                value={filters.minPrice}
                onChange={(event) =>
                  updateFilter('minPrice', event.target.value)
                }
              />
            </label>

            <label>
              Maximum price (₹)
              <input
                type="number"
                min="0"
                placeholder="No limit"
                value={filters.maxPrice}
                onChange={(event) =>
                  updateFilter('maxPrice', event.target.value)
                }
              />
            </label>
          </div>

          <button
            type="button"
            className="reset-filters"
            onClick={resetFilters}
          >
            Reset all filters
          </button>
        </div>
      )}

      <p className="results-count" aria-live="polite">
        Showing {resultCount} {resultCount === 1 ? 'product' : 'products'}
      </p>
    </section>
  );
}

export default ProductFilter;
