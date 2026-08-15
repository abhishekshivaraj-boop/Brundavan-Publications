import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import upiQR from "../assets/payment/upi-qr.png";

const API_URL = "http://localhost:8081/api";

function Checkout() {
  const navigate = useNavigate();

  const [cart, setCart] = useState([]);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const [showPayment, setShowPayment] =
    useState(false);

  const [transactionId, setTransactionId] =
    useState("");

  const [paymentMessage, setPaymentMessage] =
    useState("");

  useEffect(() => {
    const saved =
      JSON.parse(
        localStorage.getItem("cart")
      ) || [];

    setCart(saved);
  }, []);

  const total = cart.reduce(
    (sum, item) =>
      sum +
      Number(item.price || 0) *
        Number(item.quantity || 0),
    0
  );

  const handleChange = (event) => {
    const {
      name,
      value,
    } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const continueToPayment = (
    event
  ) => {
    event.preventDefault();

    if (cart.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    if (
      !form.name.trim() ||
      !form.email.trim() ||
      !form.phone.trim() ||
      !form.address.trim()
    ) {
      alert(
        "Please fill in all delivery details."
      );
      return;
    }

    setPaymentMessage("");
    setShowPayment(true);
  };

  const handlePaymentComplete =
    async () => {
      setPaymentMessage("");

      if (!transactionId.trim()) {
        setPaymentMessage(
          "Please enter your UPI Transaction ID / UTR."
        );
        return;
      }

      const confirmed =
        window.confirm(
          `Have you completed the UPI payment of ₹${total.toFixed(
            2
          )}?`
        );

      if (!confirmed) {
        return;
      }

      const order = {
        customerName:
          form.name.trim(),

        customerEmail:
          form.email.trim(),

        customerPhone:
          form.phone.trim(),

        shippingAddress:
          form.address.trim(),

        totalAmount:
          Number(total),

        finalAmount:
          Number(total),

        discountCode: null,

        paymentMethod: "UPI",

        upiTransactionId:
          transactionId.trim(),

        paymentStatus: "PENDING",

        orderStatus: "PLACED",

        orderItems: cart.map(
          (item) => ({
            book: {
              id: Number(item.id),
            },

            quantity:
              Number(item.quantity),

            price:
              Number(item.price || 0),
          })
        ),
      };

      try {
        const response =
          await fetch(
            `${API_URL}/orders`,
            {
              method: "POST",
              headers: {
                "Content-Type":
                  "application/json",
              },
              body: JSON.stringify(
                order
              ),
            }
          );

        const text =
          await response.text();

        if (!response.ok) {
          throw new Error(
            text || "Order failed"
          );
        }

        const savedOrder =
          JSON.parse(text);

        localStorage.setItem(
          "lastOrder",
          JSON.stringify(
            savedOrder
          )
        );

        localStorage.removeItem(
          "cart"
        );

        navigate(
          "/order-success"
        );
      } catch (error) {
        console.error(error);

        setPaymentMessage(
          "Unable to place the order. Please try again."
        );
      }
    };

  if (cart.length === 0) {
    return (
      <section className="books-page">
        <div className="container">

          <p className="section-tag">
            CHECKOUT
          </p>

          <h2>
            Your Cart Is Empty
          </h2>

          <p className="section-text">
            Please add a book to your
            cart before proceeding.
          </p>

          <Link
            to="/books"
            className="primary-btn"
          >
            Explore Books
          </Link>

        </div>
      </section>
    );
  }

  return (
    <section className="books-page">
      <div className="container">

        <p className="section-tag">
          {showPayment
            ? "PAYMENT"
            : "CHECKOUT"}
        </p>

        <h2>
          {showPayment
            ? "Complete Your Payment"
            : "Checkout"}
        </h2>

        {!showPayment ? (
          <div className="checkout-container">

            <form
              className="checkout-form"
              onSubmit={
                continueToPayment
              }
            >
              <h3>
                Delivery Details
              </h3>

              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={form.name}
                onChange={handleChange}
                required
              />

              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={form.email}
                onChange={handleChange}
                required
              />

              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={form.phone}
                onChange={handleChange}
                required
              />

              <textarea
                name="address"
                placeholder="Full Shipping Address"
                rows="5"
                value={form.address}
                onChange={handleChange}
                required
              />

              <button
                type="submit"
                className="primary-btn"
              >
                Continue to Payment
              </button>
            </form>

            <div className="checkout-summary">
              <h3>
                Order Summary
              </h3>

              {cart.map((item) => (
                <div
                  className="checkout-item"
                  key={`${item.id}-${item.medium}`}
                >
                  <div>
                    <strong>
                      {item.title}
                    </strong>

                    <p>
                      {item.medium} Medium
                    </p>

                    <p>
                      ₹
                      {Number(
                        item.price || 0
                      ).toFixed(2)}
                      {" × "}
                      {item.quantity}
                    </p>
                  </div>

                  <strong>
                    ₹
                    {(
                      Number(
                        item.price || 0
                      ) *
                      Number(
                        item.quantity || 0
                      )
                    ).toFixed(2)}
                  </strong>
                </div>
              ))}

              <div className="checkout-total">
                <span>
                  Total
                </span>

                <strong>
                  ₹
                  {total.toFixed(2)}
                </strong>
              </div>

              <Link
                to="/cart"
                className="secondary-btn"
              >
                Back to Cart
              </Link>
            </div>

          </div>
        ) : (
          <div className="payment-container">

            <div className="payment-box">

              <h3>
                UPI Payment
              </h3>

              <p>
                Scan the QR code below
                using your UPI app.
              </p>

              <div className="upi-qr">
                <img
                  src={upiQR}
                  alt="Brundavan Publications UPI QR Code"
                />
              </div>

              <div className="upi-details">

                <p>
                  <strong>
                    UPI ID:
                  </strong>{" "}
                  7406162991@ybl
                </p>

                <p>
                  <strong>
                    Amount:
                  </strong>{" "}
                  ₹
                  {total.toFixed(2)}
                </p>

              </div>

              <input
                type="text"
                className="transaction-input"
                placeholder="UPI Transaction ID / UTR"
                value={transactionId}
                onChange={(event) =>
                  setTransactionId(
                    event.target.value
                  )
                }
              />

              {paymentMessage && (
                <p className="payment-message">
                  {paymentMessage}
                </p>
              )}

              <button
                type="button"
                className="primary-btn"
                onClick={
                  handlePaymentComplete
                }
              >
                Confirm Payment & Place Order
              </button>

              <button
                type="button"
                className="payment-back-btn"
                onClick={() =>
                  setShowPayment(false)
                }
              >
                ← Back to Delivery Details
              </button>

            </div>

            <div className="checkout-summary">
              <h3>
                Order Summary
              </h3>

              {cart.map((item) => (
                <div
                  className="checkout-item"
                  key={`${item.id}-${item.medium}`}
                >
                  <div>
                    <strong>
                      {item.title}
                    </strong>

                    <p>
                      {item.medium} Medium
                    </p>

                    <p>
                      ₹
                      {Number(
                        item.price || 0
                      ).toFixed(2)}
                      {" × "}
                      {item.quantity}
                    </p>
                  </div>

                  <strong>
                    ₹
                    {(
                      Number(
                        item.price || 0
                      ) *
                      Number(
                        item.quantity || 0
                      )
                    ).toFixed(2)}
                  </strong>
                </div>
              ))}

              <div className="checkout-total">
                <span>
                  Total
                </span>

                <strong>
                  ₹
                  {total.toFixed(2)}
                </strong>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default Checkout;