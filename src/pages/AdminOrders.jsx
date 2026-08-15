import { useEffect, useState } from "react";

const API_URL =
  "http://localhost:8081/api";

function AdminOrders() {
  const [orders, setOrders] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await fetch(
          `${API_URL}/orders`
        );

      if (!response.ok) {
        throw new Error(
          "Failed to fetch orders"
        );
      }

      const data =
        await response.json();

      const sorted = [...data].sort(
        (a, b) =>
          new Date(b.createdAt || 0) -
          new Date(a.createdAt || 0)
      );

      setOrders(sorted);

    } catch (error) {
      console.error(error);
      setError(
        "Unable to load orders."
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-page">
        <h1>Orders</h1>
        <p>
          Loading orders...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-page">
        <h1>Orders</h1>

        <p>{error}</p>

        <button
          type="button"
          className="primary-btn"
          onClick={fetchOrders}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="admin-page">

      <div className="admin-header">

        <div>
          <p className="section-tag">
            BRUNDAVAN PUBLICATIONS
          </p>

          <h1>
            Orders
          </h1>

          <p>
            View customer orders,
            payment information and
            order details.
          </p>
        </div>

        <button
          type="button"
          className="primary-btn"
          onClick={fetchOrders}
        >
          Refresh Orders
        </button>

      </div>

      {orders.length === 0 ? (
        <div className="admin-form-card">
          <h2>
            No Orders
          </h2>

          <p>
            There are currently no orders.
          </p>
        </div>
      ) : (
        <div className="admin-orders">

          {orders.map((order) => (
            <div
              className="admin-order-card"
              key={order.id}
            >

              <div className="admin-order-header">

                <div>
                  <h2>
                    Order #{order.id}
                  </h2>

                  <p>
                    {order.createdAt
                      ? new Date(
                          order.createdAt
                        ).toLocaleString()
                      : "-"}
                  </p>
                </div>

                <strong>
                  ₹
                  {Number(
                    order.finalAmount ??
                      order.totalAmount ??
                      0
                  ).toFixed(2)}
                </strong>

              </div>

              <div className="admin-order-details">

                <div>
                  <h3>
                    Customer
                  </h3>

                  <p>
                    <strong>
                      Name:
                    </strong>{" "}
                    {order.customerName ||
                      "-"}
                  </p>

                  <p>
                    <strong>
                      Email:
                    </strong>{" "}
                    {order.customerEmail ||
                      "-"}
                  </p>

                  <p>
                    <strong>
                      Phone:
                    </strong>{" "}
                    {order.customerPhone ||
                      "-"}
                  </p>

                  <p>
                    <strong>
                      Address:
                    </strong>
                    <br />
                    {order.shippingAddress ||
                      "-"}
                  </p>
                </div>

                <div>
                  <h3>
                    Payment
                  </h3>

                  <p>
                    <strong>
                      Method:
                    </strong>{" "}
                    {order.paymentMethod ||
                      "-"}
                  </p>

                  <p>
                    <strong>
                      UTR:
                    </strong>{" "}
                    {order.upiTransactionId ||
                      "-"}
                  </p>

                  <p>
                    <strong>
                      Payment:
                    </strong>{" "}
                    {order.paymentStatus ||
                      "-"}
                  </p>

                  <p>
                    <strong>
                      Order:
                    </strong>{" "}
                    {order.orderStatus ||
                      "-"}
                  </p>
                </div>

              </div>

              <div className="admin-order-items">

                <h3>
                  Items
                </h3>

                {Array.isArray(
                  order.orderItems
                ) &&
                order.orderItems.length >
                  0 ? (
                  order.orderItems.map(
                    (item) => (
                      <div
                        className="admin-order-item"
                        key={item.id}
                      >
                        <div>
                          <strong>
                            {
                              item.book?.title
                            }
                          </strong>

                          <p>
                            Quantity:{" "}
                            {
                              item.quantity
                            }
                          </p>
                        </div>

                        <strong>
                          ₹
                          {(
                            Number(
                              item.price ||
                                0
                            ) *
                            Number(
                              item.quantity ||
                                0
                            )
                          ).toFixed(2)}
                        </strong>
                      </div>
                    )
                  )
                ) : (
                  <p>
                    No order items.
                  </p>
                )}

              </div>

              <div className="admin-order-total">

                <span>
                  Total Amount
                </span>

                <strong>
                  ₹
                  {Number(
                    order.finalAmount ??
                      order.totalAmount ??
                      0
                  ).toFixed(2)}
                </strong>

              </div>

            </div>
          ))}

        </div>
      )}

    </div>
  );
}

export default AdminOrders;