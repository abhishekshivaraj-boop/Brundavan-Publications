import { useState } from "react";
import { Link } from "react-router-dom";

function Navbar() {
  const [open, setOpen] =
    useState(false);

  const closeMenu = () => {
    setOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">

        <Link
          to="/"
          className="brand"
          onClick={closeMenu}
        >
          <div>
            <h2>
              BRUNDAVAN
            </h2>

            <span>
              PUBLICATIONS
            </span>
          </div>
        </Link>

        <button
          type="button"
          className="menu-button"
          onClick={() =>
            setOpen(!open)
          }
        >
          ☰
        </button>

        <div
          className={
            open
              ? "nav-links active"
              : "nav-links"
          }
        >
          <Link
            to="/"
            onClick={closeMenu}
          >
            Home
          </Link>

          <Link
            to="/books"
            onClick={closeMenu}
          >
            Books
          </Link>

          <Link
            to="/about"
            onClick={closeMenu}
          >
            About
          </Link>

          <Link
            to="/contact"
            onClick={closeMenu}
          >
            Contact
          </Link>

          <Link
            to="/cart"
            onClick={closeMenu}
          >
            Cart
          </Link>
        </div>

      </div>
    </nav>
  );
}

export default Navbar;