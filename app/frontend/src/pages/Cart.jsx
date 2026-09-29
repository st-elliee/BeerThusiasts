import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function Cart() {
  const { items, update, remove, clear, total } = useCart();
  const navigate = useNavigate();

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
        <h1 style={{
          textAlign: "center",
          color: "#2c3e50",
          marginBottom: "30px",
          fontSize: "2.5rem",
          textShadow: "1px 1px 2px rgba(0,0,0,0.1)"
        }}>
          🛒 Your Shopping Cart
        </h1>

        {items.length === 0 ? (
          <div style={{
            textAlign: "center",
            padding: "60px 20px",
            color: "#7f8c8d"
          }}>
            <div style={{ fontSize: "4rem", marginBottom: "20px" }}>🍺</div>
            <h3>Your cart is empty</h3>
            <p>Time to discover some amazing beers!</p>
            <button
              onClick={() => navigate("/catalog")}
              style={{
                padding: "12px 25px",
                background: "linear-gradient(45deg, #3498db, #2980b9)",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontSize: "1.1rem",
                cursor: "pointer",
                marginTop: "20px",
                boxShadow: "0 4px 15px rgba(52, 152, 219, 0.3)",
                transition: "transform 0.2s"
              }}
              onMouseOver={(e) => e.target.style.transform = "translateY(-2px)"}
              onMouseOut={(e) => e.target.style.transform = "translateY(0)"}
            >
              Browse Beers
            </button>
          </div>
        ) : (
          <div>
            <div style={{ marginBottom: "30px" }}>
              {items.map((it) => (
                <div key={it.beer_id} style={{
                  display: "flex",
                  alignItems: "center",
                  background: "#f8f9fa",
                  padding: "20px",
                  borderRadius: "10px",
                  marginBottom: "15px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  transition: "transform 0.2s"
                }}
                onMouseOver={(e) => e.target.style.transform = "translateY(-2px)"}
                onMouseOut={(e) => e.target.style.transform = "translateY(0)"}
                >
                  <div style={{
                    flex: 1,
                    fontSize: "1.2rem",
                    fontWeight: "bold",
                    color: "#2c3e50"
                  }}>
                    🍺 {it.beer_name}
                  </div>

                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "15px"
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <label style={{ fontWeight: "bold", color: "#34495e" }}>Qty:</label>
                      <input
                        type="number"
                        value={it.quantity}
                        min={1}
                        onChange={(e) => update(it.beer_id, Number(e.target.value))}
                        style={{
                          width: "60px",
                          padding: "5px",
                          border: "2px solid #ecf0f1",
                          borderRadius: "5px",
                          textAlign: "center"
                        }}
                      />
                    </div>

                    <div style={{
                      fontSize: "1.1rem",
                      fontWeight: "bold",
                      color: "#27ae60",
                      minWidth: "80px",
                      textAlign: "right"
                    }}>
                      €{(it.price * it.quantity).toFixed(2)}
                    </div>

                    <button
                      onClick={() => remove(it.beer_id)}
                      style={{
                        padding: "8px 15px",
                        background: "#e74c3c",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                        fontSize: "0.9rem",
                        transition: "background 0.2s"
                      }}
                      onMouseOver={(e) => e.target.style.background = "#c0392b"}
                      onMouseOut={(e) => e.target.style.background = "#e74c3c"}
                    >
                      🗑️ Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Total and Actions */}
            <div style={{
              background: "linear-gradient(45deg, #2c3e50, #34495e)",
              color: "white",
              padding: "25px",
              borderRadius: "10px",
              textAlign: "center",
              boxShadow: "0 4px 15px rgba(0,0,0,0.2)"
            }}>
              <div style={{
                fontSize: "1.5rem",
                marginBottom: "20px"
              }}>
                <strong>Total: €{total.toFixed(2)}</strong>
              </div>

              <div style={{
                display: "flex",
                gap: "15px",
                justifyContent: "center",
                flexWrap: "wrap"
              }}>
                <button
                  onClick={() => navigate("/checkout")}
                  style={{
                    padding: "12px 30px",
                    background: "linear-gradient(45deg, #27ae60, #229954)",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "1.1rem",
                    fontWeight: "bold",
                    cursor: "pointer",
                    boxShadow: "0 4px 15px rgba(39, 174, 96, 0.3)",
                    transition: "transform 0.2s"
                  }}
                  onMouseOver={(e) => e.target.style.transform = "translateY(-2px)"}
                  onMouseOut={(e) => e.target.style.transform = "translateY(0)"}
                >
                  ✅ Proceed to Checkout
                </button>

                <button
                  onClick={() => navigate("/catalog")}
                  style={{
                    padding: "12px 30px",
                    background: "linear-gradient(45deg, #3498db, #2980b9)",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "1.1rem",
                    cursor: "pointer",
                    boxShadow: "0 4px 15px rgba(52, 152, 219, 0.3)",
                    transition: "transform 0.2s"
                  }}
                  onMouseOver={(e) => e.target.style.transform = "translateY(-2px)"}
                  onMouseOut={(e) => e.target.style.transform = "translateY(0)"}
                >
                  ➕ Add More Beers
                </button>

                <button
                  onClick={() => {
                    if (window.confirm("Are you sure you want to clear your cart?")) {
                      clear();
                    }
                  }}
                  style={{
                    padding: "12px 30px",
                    background: "linear-gradient(45deg, #e74c3c, #c0392b)",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "1.1rem",
                    cursor: "pointer",
                    boxShadow: "0 4px 15px rgba(231, 76, 60, 0.3)",
                    transition: "transform 0.2s"
                  }}
                  onMouseOver={(e) => e.target.style.transform = "translateY(-2px)"}
                  onMouseOut={(e) => e.target.style.transform = "translateY(0)"}
                >
                  🗑️ Clear Cart
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
