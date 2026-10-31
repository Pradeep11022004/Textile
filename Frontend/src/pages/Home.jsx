
import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import About from "../components/About";
import Contact from "../components/Contact";
import CustomerReviews from "./CustomerReviews";
import "../styles/Home.css";

const categories = [
  {
    title: "Silk Sarees",
    image:
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=85",
  },
  {
    title: "Cotton Fabrics",
    image:
      "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=800&q=85",
  },
  {
    title: "Dress Materials",
    image:
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=800&q=85",
  },
  {
    title: "Designer Sarees",
    image:
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=85",
  },
  {
    title: "Blouse Materials",
    image:
      "https://images.unsplash.com/photo-1551232864-3f0890e580d9?auto=format&fit=crop&w=800&q=85",
  },
  {
    title: "Linen Fabrics",
    image:
      "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=800&q=85",
  },
  {
    title: "Wedding Collection",
    image:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=85",
  },
  {
    title: "Printed Fabrics",
    image:
      "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=800&q=85",
  },
];

const occasions = [
  {
    title: "Wedding Wear",
    description: "Elegant fabrics for your special day.",
    image:
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=85",
  },
  {
    title: "Festive Celebrations",
    description: "Rich colours for memorable celebrations.",
    image:
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=900&q=85",
  },
  {
    title: "Everyday Elegance",
    description: "Comfortable fabrics for everyday style.",
    image:
      "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=900&q=85",
  },
  {
    title: "Party Wear",
    description: "Stand out at every special occasion.",
    image:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=85",
  },
];

const fallbackImage =
  "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=85";

function handleImageError(event) {
  const image = event.currentTarget;

  if (image.src !== fallbackImage) {
    image.src = fallbackImage;
  }
}

function Home() {
  const location = useLocation();

  // Scroll to the correct section based on the route.
  useEffect(() => {
    const sectionMap = {
      "/about": "about",
      "/contact": "contact",
      "/customer-reviews": "customer-reviews",
    };

    const sectionId = sectionMap[location.pathname];

    if (!sectionId) return;

    const timer = setTimeout(() => {
      document.getElementById(sectionId)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 200);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <main className="home-page">

      {/* HERO SECTION */}
      <section className="hero">
        <div className="hero-content">
          <p className="hero-label">
            TRADITION MEETS ELEGANCE
          </p>

          <h1>
            Woven with Love.
            <br />
            Worn with Pride.
          </h1>

          <p className="hero-description">
            Discover beautiful fabrics, timeless silk sarees,
            and elegant textiles crafted for every occasion.
          </p>

          <Link to="/products" className="shop-button">
            Explore Collection
            <span>→</span>
          </Link>

          <div className="hero-stats">
            <div>
              <strong>Premium</strong>
              <span>Quality Fabrics</span>
            </div>

            <div>
              <strong>Timeless</strong>
              <span>Textile Collections</span>
            </div>
          </div>
        </div>

        <div className="hero-image">
          <img
            src={categories[0].image}
            alt="Traditional Indian textile collection"
            onError={handleImageError}
          />

          <div className="image-caption">
            <span>AURA TEXTILE COLLECTION</span>
            <strong>Elegance in every thread</strong>
          </div>
        </div>
      </section>

      {/* SHOP BY CATEGORY */}
      <section className="categories">
        <div className="section-heading">
          <p>EXPLORE OUR WORLD</p>
          <h2>Shop by Category</h2>
          <span>
            Find the perfect fabric for your style.
          </span>
        </div>

        <div className="category-grid">
          {categories.map((category) => (
            <Link
              to="/products"
              className="category-card"
              key={category.title}
            >
              <img
                src={category.image}
                alt={category.title}
                loading="lazy"
                onError={handleImageError}
              />

              <div className="category-overlay">
                <h3>{category.title}</h3>
                <span>Explore Collection →</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* SHOP BY OCCASION */}
      <section
        className="occasion-section"
        id="shop-by-occasion"
      >
        <div className="section-heading">
          <p>FIND YOUR PERFECT FABRIC</p>
          <h2>Shop by Occasion</h2>
          <span>
            Beautiful textile collections for every special moment.
          </span>
        </div>

        <div className="occasion-grid">
          {occasions.map((occasion) => (
            <Link
              to="/products"
              className="occasion-card"
              key={occasion.title}
            >
              <img
                src={occasion.image}
                alt={occasion.title}
                loading="lazy"
                onError={handleImageError}
              />

              <div className="occasion-card-overlay">
                <span className="occasion-eyebrow">
                  DISCOVER THE COLLECTION
                </span>

                <h3>{occasion.title}</h3>

                <p>{occasion.description}</p>

                <span className="occasion-link">
                  Explore Collection →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ABOUT SECTION */}
      <About />

      {/* CONTACT SECTION */}
      <Contact />

      {/* CUSTOMER REVIEWS SECTION */}
      <div id="customer-reviews">
        <CustomerReviews />
      </div>

    </main>
  );
}

export default Home;
