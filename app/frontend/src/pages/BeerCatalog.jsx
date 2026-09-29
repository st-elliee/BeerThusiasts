import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { fetchBeers } from "../api/beer";
import BeerCard from "../components/BeerCard";
import Filters from "../components/Filters";
import { useCart } from "../context/CartContext";

export default function BeerCatalog() {
  const [beers, setBeers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({});
  const [showStickyFilters, setShowStickyFilters] = useState(false);
  const { items } = useCart();
  const navigate = useNavigate();
  const cartCount = items.reduce((s, i) => s + i.quantity, 0);

  useEffect(() => {
    const handleScroll = () => {
      setShowStickyFilters(window.scrollY > 200);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await fetchBeers(filters);
        setBeers(data);
      } catch (err) {
        console.error("Failed to load beers:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [filters]);

  // Trigger badge bounce animation
  useEffect(() => {
    const badge = document.getElementById('cart-badge');
    if (badge) {
      badge.style.animation = 'none';
      setTimeout(() => {
        badge.style.animation = 'badgeBounce 0.5s ease';
      }, 10);
    }
  }, [cartCount]);

  const role = localStorage.getItem("role");
  if (role !== "customer") return <Navigate to="/" replace />;

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="page-transition" style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
      padding: "20px"
    }}>
      <style>
        {`
          @keyframes badgeBounce {
            0%, 100% { transform: scale(1); }
            25% { transform: scale(1.3); }
            50% { transform: scale(0.9); }
            75% { transform: scale(1.2); }
          }
        `}
      </style>
      {/* Sticky Filters Bar */}
      {showStickyFilters && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          background: "rgba(255, 255, 255, 0.98)",
          boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
          padding: "15px 20px",
          backdropFilter: "blur(10px)",
          animation: "slideDown 0.3s ease-out"
        }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            <Filters onChange={handleFilterChange} />
          </div>
        </div>
      )}

      {/* Floating Cart Button */}
      {cartCount > 0 && (
        <button
          onClick={() => navigate('/cart')}
          style={{
            position: "fixed",
            bottom: "30px",
            right: "30px",
            zIndex: 1000,
            width: "60px",
            height: "60px",
            borderRadius: "50%",
            background: "linear-gradient(45deg, #e74c3c, #c0392b)",
            color: "white",
            border: "none",
            cursor: "pointer",
            boxShadow: "0 4px 20px rgba(231, 76, 60, 0.4)",
            fontSize: "1.5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.3s ease",
            fontWeight: "bold"
          }}
          onMouseOver={(e) => {
            e.target.style.transform = "scale(1.1)";
            e.target.style.boxShadow = "0 6px 25px rgba(231, 76, 60, 0.5)";
          }}
          onMouseOut={(e) => {
            e.target.style.transform = "scale(1)";
            e.target.style.boxShadow = "0 4px 20px rgba(231, 76, 60, 0.4)";
          }}
        >
          <div style={{ position: "relative" }}>
            🛒
            <div 
              id="cart-badge"
              style={{
              position: "absolute",
              top: "-8px",
              right: "-8px",
              background: "#f1c40f",
              color: "#2c3e50",
              borderRadius: "50%",
              width: "24px",
              height: "24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "0.7rem",
              fontWeight: "bold",
              border: "2px solid white"
            }}>
              {cartCount}
            </div>
          </div>
        </button>
      )}

      <div style={{
        maxWidth: "1200px",
        margin: "0 auto",
        background: "rgba(255, 255, 255, 0.95)",
        borderRadius: "15px",
        padding: "30px",
        boxShadow: "0 8px 25px rgba(0,0,0,0.1)"
      }}>
        {/* Header */}
        <div style={{
          textAlign: "center",
          marginBottom: "40px",
          borderBottom: "3px solid #ecf0f1",
          paddingBottom: "20px"
        }}>
          <h1 style={{
            color: "#2c3e50",
            margin: "0 0 10px 0",
            fontSize: "3rem",
            textShadow: "2px 2px 4px rgba(0,0,0,0.1)",
            fontWeight: "bold"
          }}>
            🍺 Beer Catalog
          </h1>
          <p style={{
            color: "#7f8c8d",
            fontSize: "1.2rem",
            margin: 0,
            fontStyle: "italic"
          }}>
            Discover your perfect brew from our curated selection
          </p>
        </div>

        {/* Filters */}
        <Filters onChange={handleFilterChange} />

        {/* Loading State */}
        {loading && (
          <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "60px 20px",
            color: "#7f8c8d"
          }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "3rem", marginBottom: "20px" }}>🍻</div>
              <div style={{ fontSize: "1.5rem", fontWeight: "bold" }}>Loading beers...</div>
              <div style={{ fontSize: "1rem", marginTop: "10px" }}>Finding the perfect brews for you</div>
            </div>
          </div>
        )}

        {/* Beer Grid */}
        {!loading && (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
            gap: "25px",
            marginTop: "20px"
          }}>
            {beers.length === 0 ? (
              <div style={{
                gridColumn: "1 / -1",
                textAlign: "center",
                padding: "80px 20px",
                color: "#7f8c8d"
              }}>
                <div style={{ fontSize: "4rem", marginBottom: "20px" }}>🔍</div>
                <h3 style={{ margin: "0 0 10px 0", color: "#2c3e50" }}>No beers found</h3>
                <p>Try adjusting your filters to discover more brews!</p>
              </div>
            ) : (
              beers.map((beer) => (
                <BeerCard key={beer.beer_id} beer={beer} />
              ))
            )}
          </div>
        )}

        {/* Footer Stats */}
        {!loading && beers.length > 0 && (
          <div style={{
            marginTop: "40px",
            padding: "20px",
            background: "linear-gradient(45deg, #3498db, #2980b9)",
            borderRadius: "10px",
            color: "white",
            textAlign: "center",
            boxShadow: "0 4px 15px rgba(52, 152, 219, 0.3)"
          }}>
            <h3 style={{ margin: "0 0 10px 0", fontSize: "1.2rem" }}>
              📊 Catalog Summary
            </h3>
            <div style={{ fontSize: "1.1rem", fontWeight: "bold" }}>
              {beers.length} beer{beers.length !== 1 ? 's' : ''} available in our catalog
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
