import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Cart() {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = () => {
    const saved =
      JSON.parse(
        localStorage.getItem("cart")
      ) || [];

    setCart(saved);
  };

  const saveCart = (updatedCart) => {
    setCart(updatedCart);

    localStorage.setItem(
      "cart",
      JSON.stringify(updatedCart)
    );
  };

  const increaseQuantity = (
    id,
    medium
  ) => {
    const updated = cart.map((item) =>
      String(item.id) ===
        String(id) &&
      item.medium === medium
        ? {
            ...item,
            quantity:
              Number(item.quantity || 0) + 1,
          }
        : item
    );

    saveCart(updated);
  };

  const decreaseQuantity = (
    id,
    medium
  ) => {
    const updated = cart
      .map((item) =>
        String(item.id) ===
          String(id) &&
        item.medium === medium
          ? {
              ...item,
              quantity:
                Number(item.quantity || 0) - 1,
            }
          : item
      )
      .filter(
        (item) =>
          Number(item.quantity) > 0
      );

    saveCart(updated);
  };

  const removeItem = (
    id,
    medium
  ) => {
    const updated = cart.filter(
      (item) =>
        !(
          String(item.id) ===
            String(id) &&
          item.medium === medium
        )
    );

    saveCart(updated);
  };

  const total = cart.reduce(
    (sum, item) =>
      sum +
      Number(item.price || 0) *
        Number(item.quantity || 0),
    0
  );

  if (cart.length === 0) {
    return (
      <section className="books-page">
        <div className="container">

          <p className="section-tag">
            YOUR CART
          </p>

          <h2>
            Shopping Cart
          </h2>

          <div className="cart-empty">
            <h3>
              Your cart is empty
            </h3>

            <p>
              Explore our books and add
              your favourite books to the cart.
            </p>

            <Link
              to="/books"
              className="primary-btn"
            >
              Explore Books
            </Link>
          </div>

        </div>
      </section>
    );
  }

  return (
    <section className="books-page">
      <div className="container">

        <p className="section-tag">
          YOUR CART
        </p>

        <h2>
          Shopping Cart
        </h2>

        <div className="cart-container">

          <div className="cart-items">

            {cart.map((item) => (
              <div
                className="cart-item"
                key={`${item.id}-${item.medium}`}
              >

                <img
                  src={item.image}
                  alt={item.title}
                />

                <div className="cart-item-info">

                  <h3>
                    {item.title}
                  </h3>

                  <p className="cart-medium">
                    Medium:{" "}
                    <strong>
                      {item.medium}
                    </strong>
                  </p>

                  <div className="cart-price">
                    <span>
                      ₹
                      {Number(
                        item.price || 0
                      ).toFixed(2)}
                    </span>

                    {item.originalPrice &&
                      item.discount > 0 && (
                        <span className="cart-original-price">
                          ₹
                          {Number(
                            item.originalPrice
                          ).toFixed(2)}
                        </span>
                      )}
                  </div>

                  <div className="quantity-controls">

                    <button
                      type="button"
                      onClick={() =>
                        decreaseQuantity(
                          item.id,
                          item.medium
                        )
                      }
                    >
                      −
                    </button>

                    <span>
                      {item.quantity}
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        increaseQuantity(
                          item.id,
                          item.medium
                        )
                      }
                    >
                      +
                    </button>

                  </div>

                  <button
                    type="button"
                    className="remove-btn"
                    onClick={() =>
                      removeItem(
                        item.id,
                        item.medium
                      )
                    }
                  >
                    Remove
                  </button>

                </div>

                <div className="cart-item-total">
                  ₹
                  {(
                    Number(item.price || 0) *
                    Number(item.quantity || 0)
                  ).toFixed(2)}
                </div>

              </div>
            ))}

          </div>

          <div className="cart-summary">

            <h3>
              Cart Summary
            </h3>

            <div className="cart-summary-row">
              <span>
                Items
              </span>

              <span>
                {cart.reduce(
                  (sum, item) =>
                    sum +
                    Number(
                      item.quantity || 0
                    ),
                  0
                )}
              </span>
            </div>

            <div className="cart-summary-row total">
              <span>
                Total
              </span>

              <strong>
                ₹{total.toFixed(2)}
              </strong>
            </div>

            <Link
              to="/checkout"
              className="primary-btn checkout-btn"
            >
              Proceed to Checkout
            </Link>

            <Link
              to="/books"
              className="secondary-btn continue-btn"
            >
              Continue Shopping
            </Link>

          </div>
        </div>
      </div>
    </section>
  );
}

export default Cart;