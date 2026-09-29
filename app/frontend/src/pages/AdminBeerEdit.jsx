import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchBeer, updateBeerAdmin, fetchEnum } from "../api/beer";
import UploadImageForm from "../components/UploadImageForm";

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5001";

export default function AdminBeerEdit() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [form, setForm] = useState({
    name: "",
    price: "",
    beer_kind: "",
    alcohol_content: "",
    container_kind: "",
    volume_liters: "",
    brand_id: "",
    country_of_origin: "",
  });
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [containerOptions, setContainerOptions] = useState([]);
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    const loadBeer = async () => {
      try {
        const beer = await fetchBeer(id);
        setForm({
          name: beer.beer_name || beer.name || "",
          price: beer.price || "",
          beer_kind: beer.beer_kind || "",
          alcohol_content: beer.alcohol_content || "",
          container_kind: beer.container_kind || "",
          volume_liters: beer.volume_liters || "",
          brand_id: beer.brand_id || "",
          country_of_origin: beer.country_of_origin || "",
        });
        setImageUrl(`${API_BASE}/images/beers/${id}.jpg`);
      } catch (err) {
        console.error(err);
        alert("Failed to load beer");
      } finally {
        setFetchLoading(false);
      }
    };
    loadBeer();
    (async () => {
      try {
        const res = await fetchEnum('beer', 'container_kind');
        if (res && res.values) setContainerOptions(res.values);
      } catch (e) {
        console.error('Failed to load container options', e);
      }
    })();
  }, [id]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        name: form.name,
        price: parseFloat(form.price),
        beer_kind: form.beer_kind || null,
        alcohol_content: form.alcohol_content ? parseFloat(form.alcohol_content) : null,
        container_kind: form.container_kind || null,
        volume_liters: form.volume_liters ? parseFloat(form.volume_liters) : null,
        brand_id: form.brand_id ? parseInt(form.brand_id) : null,
        country_of_origin: form.country_of_origin || null,
      };
      await updateBeerAdmin(id, payload);
      alert("Beer updated successfully!");
      navigate('/admin/beers');
    } catch (err) {
      console.error(err);
      alert("Error updating beer: " + (err.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) return <div style={{ textAlign: "center", padding: "50px" }}>Loading...</div>;

  return (
    <div className="page-transition" style={{ maxWidth: "800px", margin: "0 auto", padding: "20px", background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)", minHeight: "100vh" }}>
      <h1 style={{ textAlign: "center", color: "#2c3e50", marginBottom: "30px" }}>✏️ Edit Beer</h1>
      <button onClick={() => navigate('/admin/beers')} style={{ padding: "10px 20px", background: "#95a5a6", color: "white", border: "none", borderRadius: "5px", cursor: "pointer", marginBottom: "20px" }}>← Back to Beers</button>
      <form onSubmit={handleSubmit} style={{ background: "white", padding: "30px", borderRadius: "10px", boxShadow: "0 4px 15px rgba(0,0,0,0.1)" }}>
        <div style={{ display: "grid", gap: "15px", gridTemplateColumns: "1fr 1fr" }}>
          <div>
            <label style={{ display: "block", marginBottom: "5px", color: "#2c3e50", fontWeight: "bold" }}>🍺 Name *</label>
            <input name="name" type="text" value={form.name} onChange={handleChange} style={{ width: "100%", padding: "10px", border: "2px solid #ecf0f1", borderRadius: "8px", fontSize: "1rem" }} required />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "5px", color: "#2c3e50", fontWeight: "bold" }}>💰 Price *</label>
            <input name="price" type="number" step="0.01" value={form.price} onChange={handleChange} style={{ width: "100%", padding: "10px", border: "2px solid #ecf0f1", borderRadius: "8px", fontSize: "1rem" }} required />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "5px", color: "#2c3e50", fontWeight: "bold" }}>🍻 Beer Type</label>
            <input name="beer_kind" type="text" placeholder="e.g., lager, ale, stout" value={form.beer_kind} onChange={handleChange} style={{ width: "100%", padding: "10px", border: "2px solid #ecf0f1", borderRadius: "8px", fontSize: "1rem" }} />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "5px", color: "#2c3e50", fontWeight: "bold" }}>🍺 Alcohol Content (%)</label>
            <input name="alcohol_content" type="number" step="0.1" value={form.alcohol_content} onChange={handleChange} style={{ width: "100%", padding: "10px", border: "2px solid #ecf0f1", borderRadius: "8px", fontSize: "1rem" }} />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "5px", color: "#2c3e50", fontWeight: "bold" }}>📦 Container Type</label>
            {Array.isArray(containerOptions) && containerOptions.length > 0 ? (
              <select name="container_kind" value={form.container_kind} onChange={handleChange} style={{ width: "100%", padding: "10px", border: "2px solid #ecf0f1", borderRadius: "8px", fontSize: "1rem", background: "white", cursor: "pointer" }}>
                <option value="">Select container type</option>
                {containerOptions.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            ) : (
              <input name="container_kind" placeholder="e.g., bottle, can" value={form.container_kind} onChange={handleChange} style={{ width: "100%", padding: "10px", border: "2px solid #ecf0f1", borderRadius: "8px", fontSize: "1rem" }} />
            )}
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "5px", color: "#2c3e50", fontWeight: "bold" }}>📏 Volume (liters)</label>
            <input name="volume_liters" type="number" step="0.1" value={form.volume_liters} onChange={handleChange} style={{ width: "100%", padding: "10px", border: "2px solid #ecf0f1", borderRadius: "8px", fontSize: "1rem" }} />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "5px", color: "#2c3e50", fontWeight: "bold" }}>🏷️ Brand ID</label>
            <input name="brand_id" type="number" placeholder="Enter brand ID" value={form.brand_id} onChange={handleChange} style={{ width: "100%", padding: "10px", border: "2px solid #ecf0f1", borderRadius: "8px", fontSize: "1rem" }} />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "5px", color: "#2c3e50", fontWeight: "bold" }}>🌍 Country of Origin</label>
            <input name="country_of_origin" type="text" value={form.country_of_origin} onChange={handleChange} style={{ width: "100%", padding: "10px", border: "2px solid #ecf0f1", borderRadius: "8px", fontSize: "1rem" }} />
          </div>
        </div>
        <button type="submit" disabled={loading} style={{ marginTop: "20px", padding: "15px 30px", background: loading ? "#95a5a6" : "linear-gradient(45deg, #3498db, #2980b9)", color: "white", border: "none", borderRadius: "8px", fontSize: "1.1rem", fontWeight: "bold", cursor: loading ? "not-allowed" : "pointer" }}>
          {loading ? "🔄 Updating..." : "💾 Update Beer"}
        </button>
      </form>
      <div style={{ marginTop: "30px", background: "white", padding: "20px", borderRadius: "10px", boxShadow: "0 4px 15px rgba(0,0,0,0.1)" }}>
        <h2 style={{ color: "#2c3e50", marginBottom: "20px" }}>📷 Beer Image</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div style={{ textAlign: "center" }}>
            <img
              src={imageUrl}
              alt={form.name}
              onError={(e) => {
                if (!e.target.dataset.triedPng) {
                  e.target.dataset.triedPng = '1';
                  e.target.src = `${API_BASE}/images/beers/${id}.png`;
                  return;
                }
                e.target.style.display = 'none';
                const parent = e.target.parentNode;
                const placeholder = document.createElement('div');
                placeholder.textContent = '🍺';
                placeholder.style.fontSize = '4rem';
                placeholder.style.marginTop = '20px';
                parent.appendChild(placeholder);
              }}
              style={{ maxWidth: '200px', maxHeight: '250px', objectFit: 'contain', borderRadius: '8px' }}
            />
          </div>
          <div>
            <h3 style={{ color: "#2c3e50", marginBottom: "15px" }}>Upload New Image</h3>
            <UploadImageForm beerId={id} />
          </div>
        </div>
      </div>
    </div>
  );
}