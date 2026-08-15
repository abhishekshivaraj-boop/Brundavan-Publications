import { Link } from "react-router-dom";

function Herosection() {
  return (
    <section className="hero">
      <div className="hero-container">
        <div className="hero-content">

          <p className="hero-brand">
            BRUNDAVAN PUBLICATIONS
          </p>

          <h1>
            Prepare Today.
            <br />
            Succeed Tomorrow.
          </h1>

          <p className="hero-description">
            Quality preparation books for Jawahar Navodaya Vidyalaya
            entrance examinations.
          </p>

          <div className="hero-buttons">

            <Link to="/books" className="primary-btn">
              Explore Books
            </Link>

            <a href="#footer" className="secondary-btn">
              Contact Us
            </a>

          </div>

        </div>
      </div>
    </section>
  );
}

export default Herosection;