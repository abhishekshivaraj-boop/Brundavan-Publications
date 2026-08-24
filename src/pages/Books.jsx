import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import arithmeticImage from "../assets/books/Arithmetic.jpeg";
import mentalAbilityImage from "../assets/books/mental-ability.jpeg";
import passageImage from "../assets/books/passage.jpeg";

const API_URL = "https://brundavan-publications-production.up.railway.app/api";

function Books() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedMediums, setSelectedMediums] = useState({});

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/books`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch books");
      }

      const data = await response.json();

      setBooks(
        data.filter(
          (book) => book.isActive !== false
        )
      );
    } catch (error) {
      console.error(error);
      setError("Unable to load books.");
    } finally {
      setLoading(false);
    }
  };

  const getBookImage = (book) => {
    const subject = (
      book.subject || ""
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

  const getMediums = (book) => {
    if (!Array.isArray(book.mediums)) {
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

  const handleMediumChange = (id, medium) => {
    setSelectedMediums((previous) => ({
      ...previous,
      [id]: medium,
    }));
  };

  const handleAddToCart = (book) => {
    const selectedMedium =
      selectedMediums[book.id];

    if (!selectedMedium) {
      alert("Please select a medium first.");
      return;
    }

    const cart =
      JSON.parse(
        localStorage.getItem("cart")
      ) || [];

    const price = Number(
      book.price ?? 0
    );

    const originalPrice = Number(
      book.originalPrice ??
        book.price ??
        0
    );

    const discount = Number(
      book.discountPercent ?? 0
    );

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
          image: getBookImage(book),
          originalPrice,
          discount,
          price,
          medium: selectedMedium,
          quantity: 1,
        },
      ];
    }

    localStorage.setItem(
      "cart",
      JSON.stringify(updatedCart)
    );

    alert(
      `${book.title} (${selectedMedium}) added to cart!`
    );
  };

  if (loading) {
    return (
      <section className="books-page">
        <div className="container">
          <h2>Loading books...</h2>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="books-page">
        <div className="container">
          <h2>Unable to load books</h2>
          <p className="section-text">
            {error}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="books-page">
      <div className="container">
        <p className="section-tag">
          OUR BOOKS
        </p>

        <h2>
          Navodaya Preparation Books
        </h2>

        <p className="section-text">
          Explore our preparation books designed
          for students preparing for Jawahar
          Navodaya Vidyalaya entrance examinations.
        </p>

        {books.length === 0 ? (
          <p className="section-text">
            No books are currently available.
          </p>
        ) : (
          <div className="books-grid">
            {books.map((book) => {
              const originalPrice =
                Number(
                  book.originalPrice ??
                    book.price ??
                    0
                );

              const discount =
                Number(
                  book.discountPercent ?? 0
                );

              const finalPrice =
                Number(book.price ?? 0);

              const mediums =
                getMediums(book);

              return (
                <div
                  className="book-card"
                  key={book.id}
                >
                  <div className="book-cover">
                    <img
                      src={getBookImage(book)}
                      alt={book.title}
                    />
                  </div>

                  <div className="book-info">
                    <span className="language">
                      {book.language}
                    </span>

                    <h3>
                      {book.title}
                    </h3>

                    <p>
                      {book.description}
                    </p>

                    <div className="medium-selection">
                      <label
                        htmlFor={`medium-${book.id}`}
                      >
                        Select Medium
                      </label>

                      {mediums.length > 0 ? (
                        <select
                          id={`medium-${book.id}`}
                          value={
                            selectedMediums[
                              book.id
                            ] || ""
                          }
                          onChange={(event) =>
                            handleMediumChange(
                              book.id,
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
                          No medium available
                        </p>
                      )}
                    </div>

                    <div className="book-price">
                      {discount > 0 && (
                        <span className="discount">
                          {discount}% OFF
                        </span>
                      )}

                      <div>
                        {discount > 0 && (
                          <span className="original-price">
                            ₹
                            {originalPrice.toFixed(
                              2
                            )}
                          </span>
                        )}

                        <span className="final-price">
                          ₹
                          {finalPrice.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    <div className="price-row">
                      <button
                        type="button"
                        className="primary-btn"
                        onClick={() =>
                          handleAddToCart(book)
                        }
                      >
                        Add to Cart
                      </button>

                      <Link
                        to={`/book/${book.id}`}
                        className="secondary-btn"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

export default Books;