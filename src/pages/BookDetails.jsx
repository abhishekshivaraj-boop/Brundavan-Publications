import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import arithmeticImage from "../assets/books/Arithmetic.jpeg";
import mentalAbilityImage from "../assets/books/Mental-Ability.jpeg";
import passageImage from "../assets/books/Passage.jpeg";

const API_URL = "https://brundavan-publications-production.up.railway.app/api";

function BookDetails() {
  const { id } = useParams();

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedMedium, setSelectedMedium] =
    useState("");
  const [cartMessage, setCartMessage] =
    useState("");

  useEffect(() => {
    fetchBook();
  }, [id]);

  const fetchBook = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/books/${id}`
      );

      if (!response.ok) {
        throw new Error("Book not found");
      }

      const data = await response.json();
      setBook(data);
    } catch (error) {
      console.error(error);
      setError("Unable to load this book.");
    } finally {
      setLoading(false);
    }
  };

  const getBookImage = () => {
    const subject = (
      book?.subject || ""
    ).toUpperCase();

    if (subject === "ARITHMETIC") {
      return arithmeticImage;
    }

    if (subject === "MENTAL_ABILITY") {
      return mentalAbilityImage;
    }

    if (subject === "PASSAGES") {
      return passageImage;
    }

    return arithmeticImage;
  };

  const getMediums = () => {
    if (!Array.isArray(book?.mediums)) {
      return [];
    }

    return book.mediums
      .map((item) =>
        typeof item === "string"
          ? item
          : item?.medium
      )
      .filter(Boolean);
  };

  const handleAddToCart = () => {
    if (!selectedMedium) {
      setCartMessage(
        "Please select a medium first."
      );
      return;
    }

    const cart =
      JSON.parse(
        localStorage.getItem("cart")
      ) || [];

    const existingItem = cart.find(
      (item) =>
        String(item.id) ===
          String(book.id) &&
        item.medium === selectedMedium
    );

    let updatedCart;

    if (existingItem) {
      updatedCart = cart.map((item) =>
        String(item.id) ===
          String(book.id) &&
        item.medium === selectedMedium
          ? {
              ...item,
              quantity:
                Number(item.quantity || 0) + 1,
            }
          : item
      );
    } else {
      updatedCart = [
        ...cart,
        {
          id: book.id,
          title: book.title,
          image: getBookImage(),
          originalPrice: Number(
            book.originalPrice ??
              book.price ??
              0
          ),
          discount: Number(
            book.discountPercent ?? 0
          ),
          price: Number(
            book.price ?? 0
          ),
          medium: selectedMedium,
          quantity: 1,
        },
      ];
    }

    localStorage.setItem(
      "cart",
      JSON.stringify(updatedCart)
    );

    setCartMessage(
      `${book.title} (${selectedMedium}) added to cart!`
    );

    setTimeout(() => {
      setCartMessage("");
    }, 3000);
  };

  if (loading) {
    return (
      <section className="books-page">
        <div className="container">
          <h2>Loading book...</h2>
        </div>
      </section>
    );
  }

  if (error || !book) {
    return (
      <section className="books-page">
        <div className="container">
          <h2>Book Not Found</h2>

          <p className="section-text">
            {error}
          </p>

          <Link
            to="/books"
            className="primary-btn"
          >
            Back to Books
          </Link>
        </div>
      </section>
    );
  }

  const originalPrice = Number(
    book.originalPrice ??
      book.price ??
      0
  );

  const discount = Number(
    book.discountPercent ?? 0
  );

  const finalPrice = Number(
    book.price ?? 0
  );

  const mediums = getMediums();

  return (
    <section className="books-page">
      <div className="container">

        <div className="book-details">

          <div className="book-details-image">
            <img
              src={getBookImage()}
              alt={book.title}
            />
          </div>

          <div className="book-details-info">

            <p className="section-tag">
              BRUNDAVAN PUBLICATIONS
            </p>

            <h2>
              {book.title}
            </h2>

            <p className="language">
              {book.language}
            </p>

            <p className="section-text">
              {book.description}
            </p>

            <div className="book-details-price-section">

              {discount > 0 && (
                <span className="discount">
                  {discount}% OFF
                </span>
              )}

              <div className="book-details-prices">

                {discount > 0 && (
                  <span className="original-price">
                    ₹
                    {originalPrice.toFixed(2)}
                  </span>
                )}

                <span className="final-price">
                  ₹
                  {finalPrice.toFixed(2)}
                </span>

              </div>
            </div>

            <div className="medium-selection">

              <label htmlFor="medium">
                Select Medium
              </label>

              {mediums.length > 0 ? (
                <select
                  id="medium"
                  value={selectedMedium}
                  onChange={(event) =>
                    setSelectedMedium(
                      event.target.value
                    )
                  }
                >
                  <option value="">
                    Select Medium
                  </option>

                  {mediums.map(
                    (medium) => (
                      <option
                        key={medium}
                        value={medium}
                      >
                        {medium}
                      </option>
                    )
                  )}
                </select>
              ) : (
                <p>
                  No mediums available.
                </p>
              )}
            </div>

            {cartMessage && (
              <div className="cart-success-message">
                ✓ {cartMessage}
              </div>
            )}

            <div className="book-details-buttons">

              <button
                type="button"
                className="primary-btn"
                disabled={
                  mediums.length === 0
                }
                onClick={
                  handleAddToCart
                }
              >
                Add to Cart
              </button>

              <Link
                to="/books"
                className="secondary-btn"
              >
                Back to Books
              </Link>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default BookDetails;
