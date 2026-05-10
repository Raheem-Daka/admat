import React from "react";

const Orders = () => {
  // ✅ Mock orders (replace with API data later)
  const orders = [
    {
      id: 101,
      date: "2026-05-06",
      status: "Delivered",
      total: 125000,
    },
    {
      id: 102,
      date: "2026-05-04",
      status: "Processing",
      total: 89000,
    },
    {
      id: 103,
      date: "2026-05-01",
      status: "Cancelled",
      total: 54000,
    },
  ];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">My Orders</h1>

      {orders.length === 0 ? (
        <p className="text-gray-500 text-center">
          You haven’t placed any orders yet.
        </p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="border rounded-xl p-4 bg-white shadow-sm flex flex-col sm:flex-row justify-between gap-4"
            >
              {/* Order Info */}
              <div>
                <p className="font-semibold">
                  Order #{order.id}
                </p>
                <p className="text-sm text-gray-500">
                  Date: {order.date}
                </p>
                <p className="text-sm">
                  Status:{" "}
                  <span
                    className={`font-semibold ${
                      order.status === "Delivered"
                        ? "text-green-600"
                        : order.status === "Processing"
                        ? "text-yellow-600"
                        : "text-red-600"
                    }`}
                  >
                    {order.status}
                  </span>
                </p>
              </div>

              {/* Order Total */}
              <div className="flex flex-col items-start sm:items-end">
                <p className="font-bold text-lg text-indigo-600">
                  MWK {order.total.toLocaleString()}
                </p>
                <button className="mt-2 px-4 py-2 border rounded hover:bg-indigo-600 hover:text-white transition">
                  View Order
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;