import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchSupplierOrders, updateSupplierOrder } from "../api/beer";

export default function AdminSupplierOrders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [pubSearch, setPubSearch] = useState("");
  const [editingOrderId, setEditingOrderId] = useState(null);
  const [editingReason, setEditingReason] = useState("");
  const [editingDate, setEditingDate] = useState("");
  const [editingDateType, setEditingDateType] = useState("reason");
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const data = await fetchSupplierOrders();
      // Sort by descending ID
      const sorted = (data || []).sort((a, b) => b.supplier_order_id - a.supplier_order_id);
      setOrders(sorted);
    } catch (err) {
      console.error("Failed to load orders", err);
      alert("❌ Failed to load supplier orders");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateSupplierOrder(orderId, { status: newStatus });
      // Refresh orders
      await loadOrders();
      alert("✅ Order status updated");
    } catch (err) {
      console.error("Failed to update status", err);
      alert("❌ Failed to update order status");
    }
  };

  const handleDateSubmit = async (orderId) => {
    try {
      await updateSupplierOrder(orderId, { expected_delivery_date: editingDate || null });
      setEditingOrderId(null);
      setEditingDate("");
      setEditingDateType("reason");
      await loadOrders();
      alert("✅ Expected delivery date updated");
    } catch (err) {
      console.error("Failed to update date", err);
      alert("❌ Failed to update date");
    }
  };

  const handleReasonSubmit = async (orderId) => {
    try {
      await updateSupplierOrder(orderId, { reason_pending: editingReason });
      setEditingOrderId(null);
      setEditingReason("");
      await loadOrders();
      alert("✅ Reason updated");
    } catch (err) {
      console.error("Failed to update reason", err);
      alert("❌ Failed to update reason");
    }
  };

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    const matchesPub = pubSearch === "" || (order.pub_name && order.pub_name.toLowerCase().includes(pubSearch.toLowerCase()));
    return matchesStatus && matchesPub;
  });

  return (
    <div style={{ padding: "20px", maxWidth: "1400px", margin: "0 auto" }}>
      <h1 style={{ color: "#2c3e50", marginBottom: "30px" }}>📦 Supplier Orders</h1>

      {/* Filters */}
      <div style={{ marginBottom: "20px", display: "flex", gap: "15px", flexWrap: "wrap" }}>
        <div style={{ flex: "1", minWidth: "200px" }}>
          <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Filter by Status:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              width: "100%",
              padding: "8px",
              border: "1px solid #ddd",
              borderRadius: "4px",
              fontSize: "1rem"
            }}
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div style={{ flex: "1", minWidth: "200px" }}>
          <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Search by Pub:</label>
          <input
            type="text"
            placeholder="Enter pub name..."
            value={pubSearch}
            onChange={(e) => setPubSearch(e.target.value)}
            style={{
              width: "100%",
              padding: "8px",
              border: "1px solid #ddd",
              borderRadius: "4px",
              fontSize: "1rem"
            }}
          />
        </div>

        <div style={{ alignSelf: "flex-end", display: "flex", gap: "10px" }}>
          <button
            onClick={() => navigate('/place-order')}
            style={{
              padding: "8px 16px",
              background: "linear-gradient(45deg, #27ae60, #229954)",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "1rem",
              fontWeight: "bold"
            }}
          >
            ➕ Place Order
          </button>
          <button
            onClick={loadOrders}
            style={{
              padding: "8px 16px",
              background: "#3498db",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "1rem"
            }}
          >
            🔄 Refresh
          </button>
        </div>
      </div>

      {/* Orders Table */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "20px", color: "#7f8c8d" }}>⏳ Loading...</div>
      ) : filteredOrders.length === 0 ? (
        <div style={{ textAlign: "center", padding: "20px", color: "#7f8c8d" }}>No orders found</div>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{
            width: "100%",
            borderCollapse: "collapse",
            background: "white",
            borderRadius: "8px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
          }}>
            <thead>
              <tr style={{ background: "#34495e", color: "white" }}>
                <th style={{ padding: "12px", textAlign: "left", fontWeight: "bold" }}>Order ID</th>
                <th style={{ padding: "12px", textAlign: "left", fontWeight: "bold" }}>Order Date</th>
                <th style={{ padding: "12px", textAlign: "left", fontWeight: "bold" }}>Expected Date</th>
                <th style={{ padding: "12px", textAlign: "left", fontWeight: "bold" }}>Supplier</th>
                <th style={{ padding: "12px", textAlign: "left", fontWeight: "bold" }}>Pub</th>
                <th style={{ padding: "12px", textAlign: "left", fontWeight: "bold" }}>Total Cost</th>
                <th style={{ padding: "12px", textAlign: "left", fontWeight: "bold" }}>Status</th>
                <th style={{ padding: "12px", textAlign: "left", fontWeight: "bold" }}>Reason Pending</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr
                  key={order.supplier_order_id}
                  style={{
                    borderBottom: "1px solid #ecf0f1",
                    background: order.status === "completed" ? "#d5f4e6" : order.status === "cancelled" ? "#fadbd8" : "#fff9e6"
                  }}
                >
                  <td style={{ padding: "12px" }}>{order.supplier_order_id}</td>
                  <td style={{ padding: "12px" }}>{formatDate(order.order_date)}</td>
                  <td style={{ padding: "12px" }}>
                    {editingOrderId === order.supplier_order_id && editingDateType === "date" ? (
                      <div style={{ display: "flex", gap: "5px" }}>
                        <input
                          type="date"
                          value={editingDate}
                          onChange={(e) => setEditingDate(e.target.value)}
                          style={{
                            padding: "4px",
                            border: "1px solid #ddd",
                            borderRadius: "4px",
                            fontSize: "0.9rem"
                          }}
                        />
                        <button
                          onClick={() => handleDateSubmit(order.supplier_order_id)}
                          style={{
                            padding: "4px 8px",
                            background: "#27ae60",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                            fontSize: "0.85rem"
                          }}
                        >
                          Save
                        </button>
                        <button
                          onClick={() => {
                            setEditingOrderId(null);
                            setEditingDate("");
                            setEditingDateType("reason");
                          }}
                          style={{
                            padding: "4px 8px",
                            background: "#95a5a6",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                            fontSize: "0.85rem"
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div
                        onClick={() => {
                          setEditingOrderId(order.supplier_order_id);
                          setEditingDate(order.expected_delivery_date || "");
                          setEditingDateType("date");
                        }}
                        style={{
                          padding: "8px",
                          background: "#ecf0f1",
                          borderRadius: "4px",
                          cursor: "pointer",
                          fontSize: "0.95rem",
                          color: "#2c3e50"
                        }}
                      >
                        {formatDate(order.expected_delivery_date) || "Click to set date"}
                      </div>
                    )}
                  </td>
                  <td style={{ padding: "12px" }}>{order.supplier_name}</td>
                  <td style={{ padding: "12px" }}>{order.pub_name ? `${order.pub_name}(${order.pub_id})` : "N/A"}</td>
                  <td style={{ padding: "12px", fontWeight: "bold", color: "#e74c3c" }}>${order.total_cost}</td>
                  <td style={{ padding: "12px" }}>
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.supplier_order_id, e.target.value)}
                      style={{
                        padding: "6px 10px",
                        border: "1px solid #ddd",
                        borderRadius: "4px",
                        background:
                          order.status === "completed" ? "#27ae60" :
                          order.status === "pending" ? "#f39c12" :
                          "#e74c3c",
                        color: "white",
                        cursor: "pointer",
                        fontWeight: "bold"
                      }}
                    >
                      <option value="pending" style={{ background: "#f39c12", color: "white" }}>Pending</option>
                      <option value="completed" style={{ background: "#27ae60", color: "white" }}>Completed</option>
                      <option value="cancelled" style={{ background: "#e74c3c", color: "white" }}>Cancelled</option>
                    </select>
                  </td>
                  <td style={{ padding: "12px" }}>
                    {order.status === "pending" && editingOrderId === order.supplier_order_id && editingDateType === "reason" && (
                      <div style={{ display: "flex", gap: "5px", flexDirection: "column" }}>
                        <input
                          type="text"
                          placeholder="Enter reason..."
                          value={editingReason}
                          onChange={(e) => setEditingReason(e.target.value)}
                          style={{
                            padding: "6px",
                            border: "1px solid #ddd",
                            borderRadius: "4px",
                            fontSize: "0.9rem"
                          }}
                        />
                        <div style={{ display: "flex", gap: "5px" }}>
                          <button
                            onClick={() => handleReasonSubmit(order.supplier_order_id)}
                            style={{
                              padding: "4px 10px",
                              background: "#27ae60",
                              color: "white",
                              border: "none",
                              borderRadius: "4px",
                              cursor: "pointer",
                              fontSize: "0.85rem"
                            }}
                          >
                            Save
                          </button>
                          <button
                            onClick={() => {
                              setEditingOrderId(null);
                              setEditingReason("");
                            }}
                            style={{
                              padding: "4px 10px",
                              background: "#95a5a6",
                              color: "white",
                              border: "none",
                              borderRadius: "4px",
                              cursor: "pointer",
                              fontSize: "0.85rem"
                            }}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                    {order.status === "pending" && editingOrderId !== order.supplier_order_id && (
                      <div>
                        {order.reason_pending ? (
                          <div
                            onClick={() => {
                              setEditingOrderId(order.supplier_order_id);
                              setEditingReason(order.reason_pending || "");
                              setEditingDateType("reason");
                            }}
                            style={{
                              fontSize: "0.9rem",
                              color: "#2c3e50",
                              fontWeight: "500",
                              background: "#ecf0f1",
                              padding: "8px",
                              borderRadius: "4px",
                              cursor: "pointer"
                            }}
                          >
                            <strong>Reason:</strong> {order.reason_pending}
                          </div>
                        ) : (
                          <div
                            onClick={() => {
                              setEditingOrderId(order.supplier_order_id);
                              setEditingReason(order.reason_pending || "");
                              setEditingDateType("reason");
                            }}
                            style={{
                              padding: "8px",
                              background: "#ecf0f1",
                              borderRadius: "4px",
                              cursor: "pointer",
                              fontSize: "0.95rem",
                              color: "#7f8c8d"
                            }}
                          >
                            Click to add reason
                          </div>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
