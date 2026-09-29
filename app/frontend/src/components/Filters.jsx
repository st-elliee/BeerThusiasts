import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchBrands } from "../api/beer";
import { useCart } from "../context/CartContext";

export default function Filters({ onChange }) {
  const [brands, setBrands] = useState([]);
  const { items } = useCart();
  const count = items.reduce((s, i) => s + i.quantity, 0);

  useEffect(() => {
    let mounted = true;
    fetchBrands()
      .then((data) => {
        if (mounted) setBrands(data);
      })
      .catch((err) => {
        console.error("Failed to load brands", err);
      });
    return () => (mounted = false);
  }, []);

  return (
    <div style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "30px",
      flexWrap: "wrap",
      gap: "20px"
    }}>
      {/* Filters Section */}
      <div style={{
        display: "flex",
        gap: "12px",
        flexWrap: "wrap",
        alignItems: "center"
      }}>
        <input
          placeholder="🔍 Search beer..."
          onChange={(e) => onChange("search", e.target.value)}
          style={{
            padding: "10px 15px",
            border: "2px solid #ecf0f1",
            borderRadius: "8px",
            fontSize: "1rem",
            minWidth: "200px",
            transition: "border-color 0.2s"
          }}
          onFocus={(e) => e.target.style.borderColor = "#3498db"}
          onBlur={(e) => e.target.style.borderColor = "#ecf0f1"}
        />

        <select
          onChange={(e) => onChange("kind", e.target.value)}
          style={{
            padding: "10px 15px",
            border: "2px solid #ecf0f1",
            borderRadius: "8px",
            fontSize: "1rem",
            background: "white",
            cursor: "pointer",
            transition: "border-color 0.2s"
          }}
          onFocus={(e) => e.target.style.borderColor = "#3498db"}
          onBlur={(e) => e.target.style.borderColor = "#ecf0f1"}
        >
          <option value="">🍺 All types</option>
          <option value="lager">Lager</option>
          <option value="ale">Ale</option>
          <option value="stout">Stout</option>
          <option value="ipa">IPA</option>
        </select>

        <select
          onChange={(e) => onChange("country", e.target.value)}
          style={{
            padding: "10px 15px",
            border: "2px solid #ecf0f1",
            borderRadius: "8px",
            fontSize: "1rem",
            background: "white",
            cursor: "pointer",
            transition: "border-color 0.2s"
          }}
          onFocus={(e) => e.target.style.borderColor = "#3498db"}
          onBlur={(e) => e.target.style.borderColor = "#ecf0f1"}
        >
          <option value="">🌍 All countries</option>
          {[...new Set(brands.map(b => b.country).filter(Boolean))].sort().map((country) => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
        </select>

        <select
          onChange={(e) => onChange("brand", e.target.value)}
          style={{
            padding: "10px 15px",
            border: "2px solid #ecf0f1",
            borderRadius: "8px",
            fontSize: "1rem",
            background: "white",
            cursor: "pointer",
            transition: "border-color 0.2s"
          }}
          onFocus={(e) => e.target.style.borderColor = "#3498db"}
          onBlur={(e) => e.target.style.borderColor = "#ecf0f1"}
        >
          <option value="">🏭 All brands</option>
          {brands.map((b) => (
            <option key={b.brand_id} value={b.brand_name}>
              {b.brand_name}
            </option>
          ))}
        </select>

        <select
          onChange={(e) => onChange("sortPrice", e.target.value)}
          style={{
            padding: "10px 15px",
            border: "2px solid #ecf0f1",
            borderRadius: "8px",
            fontSize: "1rem",
            background: "white",
            cursor: "pointer",
            transition: "border-color 0.2s"
          }}
          onFocus={(e) => e.target.style.borderColor = "#3498db"}
          onBlur={(e) => e.target.style.borderColor = "#ecf0f1"}
        >
          <option value="">📊 Sort by price</option>
          <option value="asc">⬆️ Price: Low to High</option>
          <option value="desc">⬇️ Price: High to Low</option>
        </select>
      </div>

      {/* Navigation Links */}
      <div style={{
        display: "flex",
        gap: "10px",
        alignItems: "center"
      }}>
        <Link
          to="/cart"
          style={{
            textDecoration: "none",
            color: "white",
            padding: "10px 15px",
            borderRadius: "8px",
            background: "linear-gradient(45deg, #e74c3c, #c0392b)",
            fontWeight: "bold",
            transition: "all 0.2s",
            boxShadow: "0 2px 5px rgba(231, 76, 60, 0.3)"
          }}
          onMouseOver={(e) => {
            e.target.style.transform = "translateY(-2px)";
            e.target.style.boxShadow = "0 4px 10px rgba(231, 76, 60, 0.4)";
          }}
          onMouseOut={(e) => {
            e.target.style.transform = "translateY(0)";
            e.target.style.boxShadow = "0 2px 5px rgba(231, 76, 60, 0.3)";
          }}
        >
          🛒 Go to Cart ({count})
        </Link>
      </div>
    </div>
  );
}
