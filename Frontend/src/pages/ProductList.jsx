
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import ProductCard from "../components/ProductCard";
import "../styles/ProductList.css";

function ProductList() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sortBy, setSortBy] = useState("default");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [categoryError, setCategoryError] = useState("");

  // Load products and categories
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError("");

        const [productResult, categoryResult] =
          await Promise.allSettled([
            api.get("/api/products"),
            api.get("/api/categories"),
          ]);

        // Load products
        if (productResult.status === "fulfilled") {
          const productData = productResult.value;

          setProducts(
            Array.isArray(productData) ? productData : []
          );
        } else {
          throw productResult.reason;
        }

        // Load categories
        if (categoryResult.status === "fulfilled") {
          const categoryData = categoryResult.value;

          setCategories(
            Array.isArray(categoryData) ? categoryData : []
          );

          setCategoryError("");
        } else {
          setCategories([]);
          setCategoryError(
            "Unable to load categories. Please refresh the page."
          );
        }
      } catch (err) {
        setError(err.message || "Unable to load products.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Get category name
  const getCategoryName = (product) => {
    if (typeof product.category === "string") {
      return product.category;
    }

    if (product.category?.name) {
      return product.category.name;
    }

    if (product.categoryName) {
      return product.categoryName;
    }

    if (product.categoryId != null) {
      const matchedCategory = categories.find(
        (item) =>
          String(item.id) === String(product.categoryId)
      );

      return matchedCategory?.name || "";
    }

    return "";
  };

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    const searchValue = search.toLowerCase().trim();

    const result = products.filter((product) => {
      const productName = (product.name || "").toLowerCase();
      const material = (product.material || "").toLowerCase();
      const categoryName = getCategoryName(product).toLowerCase();

      const matchesSearch =
        productName.includes(searchValue) ||
        material.includes(searchValue) ||
        categoryName.includes(searchValue);

      const matchesCategory =
        category === "All" ||
        categoryName ===
          categories
            .find((item) => String(item.id) === category)
            ?.name?.toLowerCase();

      return matchesSearch && matchesCategory;
    });

    if (sortBy === "low") {
      result.sort(
        (a, b) =>
          Number(a.pricePerMetre || 0) -
          Number(b.pricePerMetre || 0)
      );
    }

    if (sortBy === "high") {
      result.sort(
        (a, b) =>
          Number(b.pricePerMetre || 0) -
          Number(a.pricePerMetre || 0)
      );
    }

    return result;
  }, [products, search, category, sortBy, categories]);

  // Reset filters
  const resetFilters = () => {
    setSearch("");
    setCategory("All");
    setSortBy("default");
  };

  // Format price
  const formatPrice = (price) =>
    Number(price || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  return (
    <main className="products-page">

      {/* Heading */}
      <section className="products-heading">
        <p className="products-eyebrow">OUR COLLECTION</p>

        <h1>Discover Our Textiles</h1>

        <p>
          Explore quality fabrics and timeless designs for every occasion.
        </p>
      </section>

      {/* Search and Filter Section */}
      <section className="product-filter-section">

        {/* Search */}
        <div className="filter-group filter-search">
          <label htmlFor="product-search">
            Search Products
          </label>

          <input
            id="product-search"
            type="text"
            placeholder="Search fabrics..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        {/* Categories */}
        <div className="filter-group">
          <label htmlFor="category-filter">
            Category
          </label>

          <select
            id="category-filter"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
          >
            <option value="All">All Categories</option>

            {categories.map((item) => (
              <option key={item.id} value={String(item.id)}>
                {item.name}
              </option>
            ))}
          </select>

          {categoryError && (
            <small className="category-error">
              {categoryError}
            </small>
          )}
        </div>

        {/* Sorting */}
        <div className="filter-group">
          <label htmlFor="sort-filter">
            Sort By
          </label>

          <select
            id="sort-filter"
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value)}
          >
            <option value="default">Recommended</option>
            <option value="low">Price: Low to High</option>
            <option value="high">Price: High to Low</option>
          </select>
        </div>

        {/* Reset */}
        <button
          type="button"
          className="filter-reset-btn"
          onClick={resetFilters}
        >
          Reset Filters
        </button>

      </section>

      {/* Product Count */}
      {!loading && !error && (
        <div className="products-result-count">
          Showing <strong>{filteredProducts.length}</strong> products
        </div>
      )}

      {/* Loading */}
      {loading && (
        <p className="no-products">
          Loading products...
        </p>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="no-products">
          <p>{error}</p>

          <button
            type="button"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      )}

      {/* Product Grid - Uses ProductCard component */}
      {!loading && !error && filteredProducts.length > 0 && (
        <section className="products-grid">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onViewDetails={() =>
                navigate(`/products/${product.id}`)
              }
            />
          ))}
        </section>
      )}

      {/* No Products */}
      {!loading && !error && filteredProducts.length === 0 && (
        <p className="no-products">
          No products match your search. Try changing your filters.
        </p>
      )}

    </main>
  );
}

export default ProductList;
