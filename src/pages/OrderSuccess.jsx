import { Link } from "react-router-dom";

function OrderSuccess() {
  const saved =
    JSON.parse(
      localStorage.getItem("lastOrder")
    ) || null;

  if (!saved) {
    return (
      <section className="books-page">
        <div className="container">
          <div className="order-success">

            <div className="success-icon">
              ✓
            </div>

            <h2>
              Order Completed
            </h2>

            <p className="section-text">
              Your order was completed successfully.
            </p>

            <Link
              to="/books"
              className="primary-btn"
            >
              Continue Shopping
            </Link>

          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="books-page">
      <div className="container">

        <div className="order-success">

          <div className="success-icon">
            ✓
          </div>

          <p className="section-tag">
            ORDER CONFIRMED
          </p>

          <h2>
            Thank You for Your Order
          </h2>

          <p className="section-text">
            Your order has been submitted
            successfully.
          </p>

          <div className="order-details">

            <h3>
              Order Details
            </h3>

            <div className="order-detail-row">
              <span>
                Order ID
              </span>

              <strong>
                #{saved.id || "-"}
              </strong>
            </div>

            <div className="order-detail-row">
              <span>
                Customer
              </span>

              <strong>
                {saved.customerName || "-"}
              </strong>
            </div>

            <div className="order-detail-row">
              <span>
                Email
              </span>

              <strong>
                {saved.customerEmail || "-"}
              </strong>
            </div>

            <div className="order-detail-row">
              <span>
                Amount
              </span>

              <strong>
                ₹
                {Number(
                  saved.finalAmount ??
                    saved.totalAmount ??
                    0
                ).toFixed(2)}
              </strong>
            </div>

            <div className="order-detail-row">
              <span>
                Payment
              </span>

              <strong>
                {saved.paymentMethod ||
                  "UPI"}
              </strong>
            </div>

            <div className="order-detail-row">
              <span>
                UTR
              </span>

              <strong>
                {saved.upiTransactionId ||
                  "-"}
              </strong>
            </div>

            <div className="order-detail-row">
              <span>
                Order Status
              </span>

              <strong>
                {saved.orderStatus ||
                  "PLACED"}
              </strong>
            </div>

          </div>

          <div className="order-success-buttons">

            <Link
              to="/books"
              className="primary-btn"
            >
              Continue Shopping
            </Link>

            <Link
              to="/"
              className="secondary-btn"
            >
              Go Home
            </Link>

          </div>
        </div>
      </div>
    </section>
  );
}

export default OrderSuccess;