import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchBeers, deleteBeerAdmin } from "../api/beer";

export default function AdminBeers() {
  const navigate = useNavigate();
  const [beers, setBeers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBeers = async () => {
      try {
        const data = await fetchBeers();
        // Sort beers by ID in ascending order
        const sortedBeers = data.sort((a, b) => a.beer_id - b.beer_id);
        setBeers(sortedBeers);
      } catch (err) {
        console.error(err);
        alert("Failed to load beers");
      } finally {
        setLoading(false);
      }
    };
    loadBeers();
    // Timeout to prevent infinite loading
    const timeout = setTimeout(() => setLoading(false), 10000);
    return () => clearTimeout(timeout);
  }, []);

  const handleDelete = async (beerId, beerName) => {
    if (!window.confirm(`Are you sure you want to delete "${beerName}"? This action cannot be undone.`)) return;
    try {
      await deleteBeerAdmin(beerId);
      setBeers(beers.filter(beer => beer.beer_id !== beerId));
      alert("Beer deleted successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to delete beer: " + (err.message || "Unknown error"));
    }
  };

  if (loading) return <div style={{ textAlign: "center", padding: "50px" }}>Loading...</div>;

  return (
    <div className="page-transition" style={{ maxWidth: "800px", margin: "0 auto", padding: "20px", background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)", minHeight: "100vh" }}>
      <h1 style={{ textAlign: "center", color: "#2c3e50", marginBottom: "30px" }}>🍺 Manage Beers</h1>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px", flexWrap: "wrap", gap: "10px" }}>
        <button onClick={() => navigate('/admin')} style={{ padding: "10px 20px", background: "#95a5a6", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>← Back to Admin</button>
        <button onClick={() => navigate('/beers/new')} style={{ padding: "10px 20px", background: "linear-gradient(45deg, #27ae60, #229954)", color: "white", border: "none", borderRadius: "5px", cursor: "pointer", fontWeight: "bold" }}>➕ Add New Beer</button>
      </div>
      <div style={{ background: "white", borderRadius: "10px", overflow: "hidden", boxShadow: "0 4px 15px rgba(0,0,0,0.1)" }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: "#2c3e50", color: "white" }}>
              <th style={{ padding: '15px', textAlign: 'left', fontWeight: "bold" }}>ID</th>
              <th style={{ padding: '15px', textAlign: 'left', fontWeight: "bold" }}>Name</th>
              <th style={{ padding: '15px', textAlign: 'center', fontWeight: "bold" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {beers.map((beer) => (
              <tr key={beer.beer_id} style={{ borderBottom: "1px solid #ecf0f1" }}>
                <td style={{ padding: '15px' }}>{beer.beer_id}</td>
                <td style={{ padding: '15px' }}>{beer.name || beer.beer_name || 'Unknown'}</td>
                <td style={{ padding: '15px', textAlign: 'center' }}>
                  <button onClick={() => navigate(`/admin/beers/${beer.beer_id}/edit`)} style={{ padding: "8px 15px", background: "#3498db", color: "white", border: "none", borderRadius: "5px", cursor: "pointer", marginRight: "10px" }}>Edit</button>
                  <button onClick={() => handleDelete(beer.beer_id, beer.name || beer.beer_name || 'Unknown')} style={{ padding: "8px 15px", background: "#e74c3c", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}