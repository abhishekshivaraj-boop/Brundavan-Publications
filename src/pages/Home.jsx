import { Link } from "react-router-dom";

function Home() {
  return (
    <main>
      <section className="hero">
        <div className="hero-container">
          <div className="hero-content">
            <p className="hero-brand">
              BRUNDAVAN PUBLICATIONS
            </p>

            <h1>
              Quality Preparation Books
              <br />
              for Navodaya Aspirants
            </h1>

            <p className="hero-description">
              Explore carefully designed preparation
              books for students preparing for Jawahar
              Navodaya Vidyalaya entrance examinations.
            </p>

            <div className="hero-buttons">
              <Link
                to="/books"
                className="primary-btn"
              >
                Explore Books
              </Link>

              <Link
                to="/about"
                className="secondary-btn"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="welcome-section">
        <div className="container">
          <p className="section-tag">
            WHY BRUNDAVAN
          </p>

          <h2>
            Preparing Students for Success
          </h2>

          <p>
            Brundavan Publications provides preparation
            materials designed to help students build
            confidence, improve their fundamentals and
            prepare effectively for entrance examinations.
          </p>
        </div>
      </section>

      <section className="books-page">
        <div className="container">
          <p className="section-tag">
            OUR COLLECTION
          </p>

          <h2>
            Find the Right Preparation Book
          </h2>

          <p className="section-text">
            Browse our available books, select your
            preferred medium and place your order online.
          </p>

          <Link
            to="/books"
            className="primary-btn"
          >
            View All Books
          </Link>
        </div>
      </section>

      <section className="welcome-section">
        <div className="container">
          <p className="section-tag">
            NEED HELP?
          </p>

          <h2>
            Have a Question?
          </h2>

          <p>
            Contact Brundavan Publications for
            information about books, availability
            and orders.
          </p>

          <div className="hero-buttons">
            <Link
              to="/contact"
              className="primary-btn"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Home;