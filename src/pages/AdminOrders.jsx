import { useEffect, useState } from "react";

const API_URL = "https://brundavan-publications-production.up.railway.app/api";

const PAYMENT_STATUSES = [
  "PENDING",
  "PAID",
  "FAILED",
];

const ORDER_STATUSES = [
  "PLACED",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
];

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState({});

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/orders`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }

      const data = await response.json();

      const sortedOrders = [...data].sort(
        (a, b) =>
          new Date(b.createdAt || 0) -
          new Date(a.createdAt || 0)
      );

      setOrders(sortedOrders);
    } catch (error) {
      console.error(error);
      setError("Unable to load orders.");
    } finally {
      setLoading(false);
    }
  };

  const updatePaymentStatus = async (
    orderId,
    status
  ) => {
    const key = `payment-${orderId}`;

    try {
      setUpdating((previous) => ({
        ...previous,
        [key]: true,
      }));

      const response = await fetch(
        `${API_URL}/orders/${orderId}/payment-status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          await response.text()
        );
      }

      const updatedOrder =
        await response.json();

      setOrders((previous) =>
        previous.map((order) =>
          order.id === updatedOrder.id
            ? updatedOrder
            : order
        )
      );
    } catch (error) {
      console.error(
        "Payment status update failed:",
        error
      );

      alert(
        "Unable to update payment status."
      );
    } finally {
      setUpdating((previous) => ({
        ...previous,
        [key]: false,
      }));
    }
  };

  const updateOrderStatus = async (
    orderId,
    status
  ) => {
    const key = `order-${orderId}`;

    try {
      setUpdating((previous) => ({
        ...previous,
        [key]: true,
      }));

      const response = await fetch(
        `${API_URL}/orders/${orderId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          await response.text()
        );
      }

      const updatedOrder =
        await response.json();

      setOrders((previous) =>
        previous.map((order) =>
          order.id === updatedOrder.id
            ? updatedOrder
            : order
        )
      );
    } catch (error) {
      console.error(
        "Order status update failed:",
        error
      );

      alert(
        "Unable to update order status."
      );
    } finally {
      setUpdating((previous) => ({
        ...previous,
        [key]: false,
      }));
    }
  };

  if (loading) {
    return (
      <div className="admin-page">
        <h1>Orders</h1>
        <p>Loading orders...</p>
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

          <h1>Orders</h1>

          <p>
            View and manage customer orders,
            payments and delivery status.
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
          <h2>No Orders</h2>

          <p>
            There are currently no orders.
          </p>
        </div>
      ) : (
        <div className="admin-orders">
          {orders.map((order) => {
            const paymentKey =
              `payment-${order.id}`;

            const orderKey =
              `order-${order.id}`;

            return (
              <div
                className="admin-order-card"
                key={order.id}
              >
                {/* HEADER */}

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

                {/* CUSTOMER + PAYMENT */}

                <div className="admin-order-details">
                  <div>
                    <h3>Customer</h3>

                    <p>
                      <strong>Name:</strong>{" "}
                      {order.customerName ||
                        "-"}
                    </p>

                    <p>
                      <strong>Email:</strong>{" "}
                      {order.customerEmail ||
                        "-"}
                    </p>

                    <p>
                      <strong>Phone:</strong>{" "}
                      {order.customerPhone ||
                        "-"}
                    </p>

                    <p>
                      <strong>Address:</strong>
                      <br />
                      {order.shippingAddress ||
                        "-"}
                    </p>
                  </div>

                  <div>
                    <h3>Payment</h3>

                    <p>
                      <strong>Method:</strong>{" "}
                      {order.paymentMethod ||
                        "-"}
                    </p>

                    <p>
                      <strong>UTR:</strong>{" "}
                      {order.upiTransactionId ||
                        "-"}
                    </p>

                    <div className="admin-status-control">
                      <label>
                        Payment Status
                      </label>

                      <select
                        value={
                          order.paymentStatus ||
                          "PENDING"
                        }
                        disabled={
                          updating[paymentKey]
                        }
                        onChange={(event) =>
                          updatePaymentStatus(
                            order.id,
                            event.target.value
                          )
                        }
                      >
                        {PAYMENT_STATUSES.map(
                          (status) => (
                            <option
                              key={status}
                              value={status}
                            >
                              {status}
                            </option>
                          )
                        )}
                      </select>
                    </div>

                    <div className="admin-status-control">
                      <label>
                        Order Status
                      </label>

                      <select
                        value={
                          order.orderStatus ||
                          "PLACED"
                        }
                        disabled={
                          updating[orderKey]
                        }
                        onChange={(event) =>
                          updateOrderStatus(
                            order.id,
                            event.target.value
                          )
                        }
                      >
                        {ORDER_STATUSES.map(
                          (status) => (
                            <option
                              key={status}
                              value={status}
                            >
                              {status}
                            </option>
                          )
                        )}
                      </select>
                    </div>
                  </div>
                </div>

                {/* ITEMS */}

                <div className="admin-order-items">
                  <h3>Items</h3>

                  {Array.isArray(
                    order.orderItems
                  ) &&
                  order.orderItems.length > 0 ? (
                    order.orderItems.map(
                      (item) => (
                        <div
                          className="admin-order-item"
                          key={item.id}
                        >
                          <div>
                            <strong>
                              {item.book?.title ||
                                "Book"}
                            </strong>

                            <p>
                              Quantity:{" "}
                              {item.quantity}
                            </p>

                            <p>
                              Price: ₹
                              {Number(
                                item.price || 0
                              ).toFixed(2)}
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
                      )
                    )
                  ) : (
                    <p>
                      No order items.
                    </p>
                  )}
                </div>

                {/* TOTAL */}

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
            );
          })}
        </div>
      )}
    </div>
  );
}

export default AdminOrders;