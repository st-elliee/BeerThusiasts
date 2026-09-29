import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: "10px 20px",
      background: "linear-gradient(135deg, #2c3e50 0%, #34495e 100%)",
      color: "white",
      boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
        <Link to="/" style={{
          textDecoration: "none",
          color: "white",
          fontWeight: "bold",
          fontSize: "1.5rem",
          textShadow: "1px 1px 2px rgba(0,0,0,0.3)"
        }}>
          🍺 BeerThusiasts
        </Link>
      </div>
    </header>
  );
}
