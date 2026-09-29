import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { fetchOrderDetails } from "../api/beer";

export default function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [details, setDetails] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        // Get pub_id from location state if passed from ServiceOrders
        const pubId = location.state?.pubId || null;
        const data = await fetchOrderDetails(id, pubId);
        setDetails(data);
      } catch (err) {
        console.error(err);
        alert("❌ Failed to load order details: " + err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, location.state]);

  const totalQuantity = details.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = details.reduce((sum, item) => sum + Number(item.line_total), 0);

  if (loading) return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "50vh",
      fontSize: "1.2rem",
      color: "#7f8c8d"
    }}>
      📋 Loading order details...
    </div>
  );

  return (
    <div className="page-transition" style={{
      maxWidth: "1000px",
      margin: "0 auto",
      padding: "20px",
      background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
      minHeight: "100vh"
    }}>
      <div style={{
        background: "rgba(255, 255, 255, 0.95)",
        borderRadius: "15px",
        padding: "30px",
        boxShadow: "0 8px 25px rgba(0,0,0,0.1)"
      }}>
        {/* Header */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "30px",
          borderBottom: "2px solid #ecf0f1",
          paddingBottom: "20px"
        }}>
          <div>
            <button
              onClick={() => navigate("/service")}
              style={{
                padding: "8px 15px",
                background: "#95a5a6",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                marginBottom: "10px",
                transition: "background 0.2s"
              }}
              onMouseOver={(e) => e.target.style.background = "#7f8c8d"}
              onMouseOut={(e) => e.target.style.background = "#95a5a6"}
            >
              ← Back to Orders
            </button>
            <h1 style={{
              color: "#2c3e50",
              margin: 0,
              fontSize: "2.2rem",
              textShadow: "1px 1px 2px rgba(0,0,0,0.1)"
            }}>
              📋 Order #{id} Details
            </h1>
          </div>

          {/* Order Summary Card */}
          <div style={{
            background: "linear-gradient(45deg, #3498db, #2980b9)",
            color: "white",
            padding: "20px",
            borderRadius: "10px",
            textAlign: "center",
            boxShadow: "0 4px 15px rgba(52, 152, 219, 0.3)"
          }}>
            <h3 style={{ margin: "0 0 10px 0", fontSize: "1.2rem" }}>📊 Summary</h3>
            <div style={{ fontSize: "1.1rem", fontWeight: "bold" }}>
              {totalQuantity} items
            </div>
            <div style={{
              fontSize: "1.3rem",
              fontWeight: "bold",
              marginTop: "5px",
              color: "#f39c12"
            }}>
              €{totalAmount.toFixed(2)}
            </div>
          </div>
        </div>

        {details.length === 0 ? (
          <div style={{
            textAlign: "center",
            padding: "60px 20px",
            color: "#7f8c8d"
          }}>
            <div style={{ fontSize: "4rem", marginBottom: "20px" }}>📦</div>
            <h3>No items found in this order</h3>
            <p>This order appears to be empty.</p>
          </div>
        ) : (
          <div style={{
            background: "white",
            borderRadius: "10px",
            overflow: "hidden",
            boxShadow: "0 4px 15px rgba(0,0,0,0.1)"
          }}>
            <table style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "0.9rem"
            }}>
              <thead>
                <tr style={{ background: "#2c3e50", color: "white" }}>
                  <th style={{
                    padding: "15px 12px",
                    textAlign: "center",
                    fontWeight: "bold",
                    borderRight: "1px solid #34495e"
                  }}>
                    🔢 Line #
                  </th>
                  <th style={{
                    padding: "15px 12px",
                    textAlign: "left",
                    fontWeight: "bold",
                    borderRight: "1px solid #34495e"
                  }}>
                    🍺 Beer
                  </th>
                  <th style={{
                    padding: "15px 12px",
                    textAlign: "center",
                    fontWeight: "bold",
                    borderRight: "1px solid #34495e"
                  }}>
                    📦 Quantity
                  </th>
                  <th style={{
                    padding: "15px 12px",
                    textAlign: "right",
                    fontWeight: "bold",
                    borderRight: "1px solid #34495e"
                  }}>
                    💰 Price/Unit
                  </th>
                  <th style={{
                    padding: "15px 12px",
                    textAlign: "right",
                    fontWeight: "bold",
                    borderRight: "1px solid #34495e"
                  }}>
                    🧾 Line Total
                  </th>
                  <th style={{
                    padding: "15px 12px",
                    textAlign: "center",
                    fontWeight: "bold"
                  }}>
                    🏪 Pub
                  </th>
                </tr>
              </thead>
              <tbody>
                {details.map((item, idx) => (
                  <tr key={item.line_number} style={{
                    background: idx % 2 === 0 ? "#f8f9fa" : "white",
                    transition: "background 0.2s"
                  }}
                  onMouseOver={(e) => e.target.closest('tr').style.background = "#ecf0f1"}
                  onMouseOut={(e) => e.target.closest('tr').style.background = idx % 2 === 0 ? "#f8f9fa" : "white"}
                  >
                    <td style={{
                      padding: "12px",
                      textAlign: "center",
                      borderRight: "1px solid #ecf0f1",
                      fontWeight: "bold",
                      color: "#2c3e50"
                    }}>
                      {item.line_number}
                    </td>
                    <td style={{
                      padding: "12px",
                      borderRight: "1px solid #ecf0f1"
                    }}>
                      <div>
                        <div style={{ fontWeight: "bold", color: "#2c3e50" }}>
                          {item.beer_name}
                        </div>
                        <div style={{ fontSize: "0.8rem", color: "#7f8c8d" }}>
                          ID: {item.beer_id}
                        </div>
                      </div>
                    </td>
                    <td style={{
                      padding: "12px",
                      textAlign: "center",
                      borderRight: "1px solid #ecf0f1",
                      fontWeight: "bold"
                    }}>
                      {item.quantity}
                    </td>
                    <td style={{
                      padding: "12px",
                      textAlign: "right",
                      borderRight: "1px solid #ecf0f1",
                      fontWeight: "bold",
                      color: "#27ae60"
                    }}>
                      €{Number(item.price_per_unit).toFixed(2)}
                    </td>
                    <td style={{
                      padding: "12px",
                      textAlign: "right",
                      borderRight: "1px solid #ecf0f1",
                      fontWeight: "bold",
                      color: "#e74c3c"
                    }}>
                      €{Number(item.line_total).toFixed(2)}
                    </td>
                    <td style={{
                      padding: "12px",
                      textAlign: "center",
                      fontWeight: "bold",
                      color: item.pub_name ? "#27ae60" : "#7f8c8d"
                    }}>
                      <div>
                        {item.pub_name || "N/A"}
                        {item.pub_id && (
                          <div style={{ fontSize: "0.8rem", color: "#7f8c8d" }}>
                            ID: {item.pub_id}
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr style={{ background: "#ecf0f1", fontWeight: "bold" }}>
                  <td colSpan="2" style={{
                    padding: "15px 12px",
                    textAlign: "right",
                    borderTop: "2px solid #34495e",
                    color: "#2c3e50"
                  }}>
                    TOTAL:
                  </td>
                  <td style={{
                    padding: "15px 12px",
                    textAlign: "center",
                    borderTop: "2px solid #34495e",
                    color: "#2c3e50"
                  }}>
                    {totalQuantity}
                  </td>
                  <td style={{
                    padding: "15px 12px",
                    textAlign: "right",
                    borderTop: "2px solid #34495e",
                    color: "#2c3e50"
                  }}>
                    —
                  </td>
                  <td style={{
                    padding: "15px 12px",
                    textAlign: "right",
                    borderTop: "2px solid #34495e",
                    color: "#e74c3c",
                    fontSize: "1.1rem"
                  }}>
                    €{totalAmount.toFixed(2)}
                  </td>
                  <td style={{
                    padding: "15px 12px",
                    textAlign: "center",
                    borderTop: "2px solid #34495e"
                  }}>
                    —
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}