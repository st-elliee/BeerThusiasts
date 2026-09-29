import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { postOrder } from "../api/beer";

export default function Checkout() {
  const { items, clear, total } = useCart();
  const [customerId, setCustomerId] = useState("");
  const [pubId, setPubId] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [loading, setLoading] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [orderData, setOrderData] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(null);
    if (!customerId || !pubId) return alert("Please provide both Customer ID and Pub ID");
    if (items.length === 0) return alert("Your cart is empty");

    const payload = {
      customer_id: Number(customerId),
      pub_id: Number(pubId),
      payment_method: paymentMethod,
      items: items.map((i) => ({ beer_id: i.beer_id, quantity: i.quantity })),
    };

    try {
      setLoading(true);
      const res = await postOrder(payload);
      const totalReturned = res.total_amount ?? res.total_price ?? res.total;

      // Store order data for receipt
      setOrderData({
        orderId: res.order_id,
        total: totalReturned,
        items: [...items],
        customerId: customerId,
        pubId: pubId,
        paymentMethod: paymentMethod,
        loyaltyPointsAdded: res.loyalty_points_added,
        currentLoyaltyPoints: res.current_loyalty_points
      });

      clear();
      setShowReceipt(true);
    } catch (err) {
      console.error(err);
      setErrorMessage(err.message || "Unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleReceiptClose = () => {
    setShowReceipt(false);
    navigate("/");
  };

  return (
    <>
      <style>
        {`
          @keyframes slideDown {
            from {
              transform: translateY(-20px);
              opacity: 0;
            }
            to {
              transform: translateY(0);
              opacity: 1;
            }
          }
        `}
      </style>
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
          🛍️ Checkout
        </h1>

        {errorMessage && (
          <div style={{
            background: "linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)",
            color: "white",
            padding: "20px",
            borderRadius: "10px",
            marginBottom: "20px",
            boxShadow: "0 4px 15px rgba(231, 76, 60, 0.3)",
            display: "flex",
            alignItems: "center",
            gap: "15px",
            animation: "slideDown 0.3s ease-out"
          }}>
            <div style={{ fontSize: "2rem" }}>⚠️</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: "bold", fontSize: "1.2rem", marginBottom: "5px" }}>
                Order Failed
              </div>
              <div style={{ fontSize: "1rem" }}>
                {errorMessage}
              </div>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              style={{
                background: "rgba(255, 255, 255, 0.2)",
                border: "2px solid white",
                color: "white",
                padding: "8px 15px",
                borderRadius: "5px",
                cursor: "pointer",
                fontWeight: "bold",
                transition: "all 0.2s"
              }}
              onMouseOver={(e) => e.target.style.background = "rgba(255, 255, 255, 0.3)"}
              onMouseOut={(e) => e.target.style.background = "rgba(255, 255, 255, 0.2)"}
            >
              ✕
            </button>
          </div>
        )}

        <div style={{ display: "flex", gap: "30px", flexWrap: "wrap" }}>
          {/* Order Summary */}
          <div style={{ flex: 1, minWidth: "300px" }}>
            <h2 style={{
              color: "#2c3e50",
              marginBottom: "20px",
              borderBottom: "2px solid #3498db",
              paddingBottom: "10px"
            }}>
              📋 Order Summary
            </h2>

            <div style={{ marginBottom: "20px" }}>
              {items.map((item) => (
                <div key={item.beer_id} style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "10px 0",
                  borderBottom: "1px solid #ecf0f1"
                }}>
                  <div>
                    <span style={{ fontWeight: "bold", color: "#2c3e50" }}>
                      🍺 {item.beer_name}
                    </span>
                    <span style={{ color: "#7f8c8d", marginLeft: "10px" }}>
                      × {item.quantity}
                    </span>
                  </div>
                  <span style={{ fontWeight: "bold", color: "#27ae60" }}>
                    €{(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "15px 0",
              borderTop: "2px solid #34495e",
              fontSize: "1.2rem",
              fontWeight: "bold",
              color: "#2c3e50"
            }}>
              <span>Total:</span>
              <span style={{ color: "#e74c3c" }}>€{(total || 0).toFixed(2)}</span>
            </div>
          </div>

          {/* Checkout Form */}
          <div style={{ flex: 1, minWidth: "300px" }}>
            <h2 style={{
              color: "#2c3e50",
              marginBottom: "20px",
              borderBottom: "2px solid #3498db",
              paddingBottom: "10px"
            }}>
              💳 Checkout Details
            </h2>

            <form onSubmit={handleSubmit} style={{
              display: "flex",
              flexDirection: "column",
              gap: "20px"
            }}>
              <div>
                <label style={{
                  display: "block",
                  marginBottom: "5px",
                  color: "#2c3e50",
                  fontWeight: "bold"
                }}>
                  👤 Customer ID *
                </label>
                <input
                  value={customerId}
                  onChange={(e) => setCustomerId(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "2px solid #ecf0f1",
                    borderRadius: "8px",
                    fontSize: "1rem",
                    transition: "border-color 0.2s"
                  }}
                  onFocus={(e) => e.target.style.borderColor = "#3498db"}
                  onBlur={(e) => e.target.style.borderColor = "#ecf0f1"}
                  placeholder="Enter your customer ID"
                  required
                />
              </div>

              <div>
                <label style={{
                  display: "block",
                  marginBottom: "5px",
                  color: "#2c3e50",
                  fontWeight: "bold"
                }}>
                  🏪 Pub ID *
                </label>
                <input
                  value={pubId}
                  onChange={(e) => setPubId(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "2px solid #ecf0f1",
                    borderRadius: "8px",
                    fontSize: "1rem",
                    transition: "border-color 0.2s"
                  }}
                  onFocus={(e) => e.target.style.borderColor = "#3498db"}
                  onBlur={(e) => e.target.style.borderColor = "#ecf0f1"}
                  placeholder="Enter the pub ID where you'll pick up"
                  required
                />
              </div>

              <div>
                <label style={{
                  display: "block",
                  marginBottom: "5px",
                  color: "#2c3e50",
                  fontWeight: "bold"
                }}>
                  💰 Payment Method
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "2px solid #ecf0f1",
                    borderRadius: "8px",
                    fontSize: "1rem",
                    background: "white",
                    cursor: "pointer"
                  }}
                >
                  <option value="cash">💵 Cash</option>
                  <option value="card">💳 Card</option>
                  <option value="bank_transaction">📱 Digital Wallet</option>
                  <option value="check">📝 Check</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  padding: "15px 30px",
                  background: loading ? "#95a5a6" : "linear-gradient(45deg, #27ae60, #229954)",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "1.2rem",
                  fontWeight: "bold",
                  cursor: loading ? "not-allowed" : "pointer",
                  boxShadow: "0 4px 15px rgba(39, 174, 96, 0.3)",
                  transition: "transform 0.2s",
                  marginTop: "10px"
                }}
                onMouseOver={(e) => {
                  if (!loading) e.target.style.transform = "translateY(-2px)";
                }}
                onMouseOut={(e) => {
                  if (!loading) e.target.style.transform = "translateY(0)";
                }}
              >
                {loading ? "🔄 Placing Order..." : "🎉 Place Order"}
              </button>
            </form>

            <div style={{
              marginTop: "20px",
              padding: "15px",
              background: "#ecf0f1",
              borderRadius: "8px",
              fontSize: "0.9rem",
              color: "#7f8c8d"
            }}>
              <strong>📍 Pickup Information:</strong><br />
              Please pick up your order at the selected pub within 24 hours.
              Bring your order ID for verification.
            </div>
          </div>
        </div>
      </div>

      {/* Receipt Animation Overlay */}
      {showReceipt && orderData && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0, 0, 0, 0.8)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1000,
          animation: "fadeIn 0.5s ease-out"
        }}>
          <div style={{
            background: "white",
            borderRadius: "15px",
            padding: "30px",
            maxWidth: "500px",
            width: "90%",
            maxHeight: "80vh",
            overflow: "auto",
            boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
            animation: "receiptSlideIn 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
            transformOrigin: "center bottom"
          }}>
            {/* Receipt Header */}
            <div style={{
              textAlign: "center",
              marginBottom: "25px",
              borderBottom: "2px dashed #bdc3c7",
              paddingBottom: "20px"
            }}>
              <div style={{ fontSize: "3rem", marginBottom: "10px" }}>🧾</div>
              <h2 style={{
                color: "#2c3e50",
                margin: "0 0 5px 0",
                fontSize: "1.8rem",
                fontWeight: "bold"
              }}>
                Order Complete!
              </h2>
              <p style={{
                color: "#27ae60",
                margin: 0,
                fontSize: "1.1rem",
                fontWeight: "bold"
              }}>
                ✅ Your order has been placed successfully
              </p>
            </div>

            {/* Order Details */}
            <div style={{ marginBottom: "20px" }}>
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "10px",
                fontSize: "0.9rem"
              }}>
                <span style={{ color: "#7f8c8d" }}>Order ID:</span>
                <span style={{ fontWeight: "bold", color: "#2c3e50" }}>#{orderData.orderId}</span>
              </div>
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "10px",
                fontSize: "0.9rem"
              }}>
                <span style={{ color: "#7f8c8d" }}>Customer ID:</span>
                <span style={{ fontWeight: "bold", color: "#2c3e50" }}>{orderData.customerId}</span>
              </div>
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "10px",
                fontSize: "0.9rem"
              }}>
                <span style={{ color: "#7f8c8d" }}>Pub ID:</span>
                <span style={{ fontWeight: "bold", color: "#2c3e50" }}>{orderData.pubId}</span>
              </div>
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "15px",
                fontSize: "0.9rem"
              }}>
                <span style={{ color: "#7f8c8d" }}>Payment:</span>
                <span style={{ fontWeight: "bold", color: "#2c3e50" }}>
                  {orderData.paymentMethod === "cash" ? "💵 Cash" :
                   orderData.paymentMethod === "card" ? "💳 Card" :
                   orderData.paymentMethod === "bank_transaction" ? "📱 Digital Wallet" :
                   orderData.paymentMethod === "check" ? "📝 Check" : orderData.paymentMethod}
                </span>
              </div>
            </div>

            {/* Order Items */}
            <div style={{
              borderTop: "1px solid #ecf0f1",
              borderBottom: "1px solid #ecf0f1",
              padding: "15px 0",
              marginBottom: "20px"
            }}>
              <h3 style={{
                margin: "0 0 15px 0",
                color: "#2c3e50",
                fontSize: "1.1rem",
                textAlign: "center"
              }}>
                📦 Order Items
              </h3>
              {orderData.items.map((item, index) => (
                <div key={index} style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "8px 0",
                  borderBottom: index < orderData.items.length - 1 ? "1px dashed #ecf0f1" : "none",
                  animation: `itemFadeIn 0.5s ease-out ${index * 0.1}s both`
                }}>
                  <div style={{ flex: 1 }}>
                    <span style={{ fontWeight: "bold", color: "#2c3e50" }}>
                      🍺 {item.beer_name}
                    </span>
                    <span style={{ color: "#7f8c8d", marginLeft: "8px" }}>
                      × {item.quantity}
                    </span>
                  </div>
                  <span style={{ fontWeight: "bold", color: "#27ae60" }}>
                    €{(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            {/* Total */}
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "15px 0",
              borderTop: "2px solid #34495e",
              fontSize: "1.3rem",
              fontWeight: "bold",
              color: "#2c3e50",
              marginBottom: "25px"
            }}>
              <span>TOTAL:</span>
              <span style={{ color: "#e74c3c" }}>€{Number(orderData.total).toFixed(2)}</span>
            </div>

            {/* Loyalty Points */}
            {orderData.loyaltyPointsAdded && (
              <div style={{
                background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                padding: "20px",
                borderRadius: "10px",
                marginBottom: "20px",
                textAlign: "center",
                color: "white",
                boxShadow: "0 4px 15px rgba(245, 87, 108, 0.3)"
              }}>
                <div style={{ fontSize: "2rem", marginBottom: "8px" }}>🎁</div>
                <div style={{ fontSize: "1.1rem", fontWeight: "bold", marginBottom: "8px" }}>
                  Congratulations! You earned {orderData.loyaltyPointsAdded} points! 🎉
                </div>
                <div style={{ fontSize: "0.95rem", opacity: 0.95 }}>
                  Your total loyalty points: <strong>{orderData.currentLoyaltyPoints}</strong> points
                </div>
              </div>
            )}

            {/* Pickup Info */}
            <div style={{
              background: "#ecf0f1",
              padding: "15px",
              borderRadius: "8px",
              marginBottom: "25px",
              fontSize: "0.9rem",
              color: "#7f8c8d",
              textAlign: "center"
            }}>
              <strong>📍 Pickup Information:</strong><br />
              Please pick up your order at the selected pub within 24 hours.<br />
              Bring your order ID #{orderData.orderId} for verification.
            </div>

            {/* Close Button */}
            <button
              onClick={handleReceiptClose}
              style={{
                width: "100%",
                padding: "15px",
                background: "linear-gradient(45deg, #3498db, #2980b9)",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontSize: "1.1rem",
                fontWeight: "bold",
                cursor: "pointer",
                transition: "all 0.2s",
                boxShadow: "0 4px 15px rgba(52, 152, 219, 0.3)"
              }}
              onMouseOver={(e) => {
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow = "0 6px 20px rgba(52, 152, 219, 0.4)";
              }}
              onMouseOut={(e) => {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "0 4px 15px rgba(52, 152, 219, 0.3)";
              }}
            >
              🎉 Continue Shopping
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes receiptSlideIn {
          0% {
            opacity: 0;
            transform: scale(0.3) translateY(50px);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.05) translateY(-10px);
          }
          70% {
            transform: scale(0.98) translateY(5px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        @keyframes itemFadeIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
    </>
  );
}
