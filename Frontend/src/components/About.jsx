
import "../styles/About.css";

function About() {
  return (
    <section className="about-section" id="about">
      <div className="about-content">

        <p className="about-label">OUR STORY</p>

        <h2>
          Fabric That Brings
          <span>Your Ideas to Life</span>
        </h2>

        <p className="about-description">
          Welcome to Aura Textile, your destination for quality fabrics
          and timeless designs. We bring together beautiful
          materials, carefully selected colours, and fabrics
          for every occasion.
        </p>

        <div className="about-features">

          <article className="about-feature">
            <div className="about-feature-number">01</div>
            <h3>Quality First</h3>
            <p>Carefully selected fabrics for your needs.</p>
          </article>

          <article className="about-feature">
            <div className="about-feature-number">02</div>
            <h3>Wide Selection</h3>
            <p>Cotton, silk, linen, and more.</p>
          </article>

          <article className="about-feature">
            <div className="about-feature-number">03</div>
            <h3>Customer Focus</h3>
            <p>Helping you find the right fabric.</p>
          </article>

        </div>
      </div>
    </section>
  );
}

export default About;
