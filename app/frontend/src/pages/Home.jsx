import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

export default function Home() {
  const navigate = useNavigate();

  const enterAs = useCallback((role) => {
    localStorage.setItem("role", role);
    if (role === "customer") navigate("/catalog");
    else if (role === "admin") navigate("/admin");
    else if (role === "service") navigate("/service");
  }, [navigate]);

  return (
    <div className="page-transition" style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px"
    }}>
      <div style={{
        textAlign: "center",
        background: "rgba(255, 255, 255, 0.9)",
        padding: "40px",
        borderRadius: "20px",
        boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
        maxWidth: "600px",
        width: "100%"
      }}>
        <img src="/logo_home.png" alt="BeerThusiasts Logo" style={{ height: "300px", width: "auto", marginBottom: "-20px" }} />
        <h1 style={{
          fontSize: "3rem",
          color: "#2c3e50",
          marginBottom: "10px",
          textShadow: "2px 2px 4px rgba(0,0,0,0.1)"
        }}>
          BeerThusiasts
        </h1>
        <p style={{
          fontSize: "1.2rem",
          color: "#7f8c8d",
          marginBottom: "30px",
          fontStyle: "italic"
        }}>
          "Where Every Sip Tells a Story"
        </p>
        <p style={{
          fontSize: "1.1rem",
          color: "#34495e",
          marginBottom: "40px"
        }}>
          Choose your role and dive into the world of craft beers!
        </p>

        <div style={{
          display: "flex",
          gap: "20px",
          justifyContent: "center",
          flexWrap: "wrap"
        }}>
          <button
            onClick={() => enterAs("customer")}
            style={{
              padding: "15px 30px",
              fontSize: "1.1rem",
              background: "linear-gradient(45deg, #3498db, #2980b9)",
              color: "white",
              border: "none",
              borderRadius: "10px",
              cursor: "pointer",
              boxShadow: "0 4px 15px rgba(52, 152, 219, 0.3)",
              transition: "transform 0.2s, box-shadow 0.2s",
              minWidth: "180px"
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
            🛒 Enter as Customer
          </button>

          <button
            onClick={() => navigate("/playroom")}
            style={{
              padding: "15px 30px",
              fontSize: "1.1rem",
              background: "linear-gradient(45deg, #f39c12, #e67e22)",
              color: "white",
              border: "none",
              borderRadius: "10px",
              cursor: "pointer",
              boxShadow: "0 4px 15px rgba(243, 156, 18, 0.3)",
              transition: "transform 0.2s, box-shadow 0.2s",
              minWidth: "180px"
            }}
            onMouseOver={(e) => {
              e.target.style.transform = "translateY(-2px)";
              e.target.style.boxShadow = "0 6px 20px rgba(243, 156, 18, 0.4)";
            }}
            onMouseOut={(e) => {
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "0 4px 15px rgba(243, 156, 18, 0.3)";
            }}
          >
            🎮 Playroom
          </button>

          <button
            onClick={() => enterAs("admin")}
            style={{
              padding: "15px 30px",
              fontSize: "1.1rem",
              background: "linear-gradient(45deg, #e74c3c, #c0392b)",
              color: "white",
              border: "none",
              borderRadius: "10px",
              cursor: "pointer",
              boxShadow: "0 4px 15px rgba(231, 76, 60, 0.3)",
              transition: "transform 0.2s, box-shadow 0.2s",
              minWidth: "180px"
            }}
            onMouseOver={(e) => {
              e.target.style.transform = "translateY(-2px)";
              e.target.style.boxShadow = "0 6px 20px rgba(231, 76, 60, 0.4)";
            }}
            onMouseOut={(e) => {
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "0 4px 15px rgba(231, 76, 60, 0.3)";
            }}
          >
            ⚙️ Enter as Admin
          </button>

          <button
            onClick={() => enterAs("service")}
            style={{
              padding: "15px 30px",
              fontSize: "1.1rem",
              background: "linear-gradient(45deg, #27ae60, #229954)",
              color: "white",
              border: "none",
              borderRadius: "10px",
              cursor: "pointer",
              boxShadow: "0 4px 15px rgba(39, 174, 96, 0.3)",
              transition: "transform 0.2s, box-shadow 0.2s",
              minWidth: "180px"
            }}
            onMouseOver={(e) => {
              e.target.style.transform = "translateY(-2px)";
              e.target.style.boxShadow = "0 6px 20px rgba(39, 174, 96, 0.4)";
            }}
            onMouseOut={(e) => {
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "0 4px 15px rgba(39, 174, 96, 0.3)";
            }}
          >
            🚚 Service Employee
          </button>
        </div>

        <div style={{
          marginTop: "40px",
          padding: "20px",
          background: "rgba(255, 255, 255, 0.7)",
          borderRadius: "10px",
          border: "2px solid #ecf0f1"
        }}>
          <h3 style={{ color: "#2c3e50", marginBottom: "10px" }}>🍻 Why Choose BeerThusiasts?</h3>
          <ul style={{
            listStyle: "none",
            padding: 0,
            color: "#7f8c8d",
            textAlign: "left",
            maxWidth: "400px",
            margin: "0 auto"
          }}>
            <li>✓ Wide selection of craft beers</li>
            <li>✓ Real-time inventory management</li>
            <li>✓ Seamless ordering experience</li>
            <li>✓ Community reviews and ratings</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
