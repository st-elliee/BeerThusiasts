import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createBeerAdmin, fetchEnum } from "../api/beer";
import UploadImageForm from "./UploadImageForm";

export default function AddBeerForm({ className, onCreated }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", price: "", beer_kind: "", alcohol_content: "", container_kind: "", volume_liters: "", brand_id: "", country_of_origin: "", description: "" });
  const [loading, setLoading] = useState(false);
  const [containerOptions, setContainerOptions] = useState([]);
  const [createdBeerId, setCreatedBeerId] = useState(null);

  const handleChange = (e) => setForm((s) => ({ ...s, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e && e.preventDefault();
    if (!form.name || form.price === "") return alert("Name and price required");
    setLoading(true);
    try {
      const payload = {
        name: form.name,
        price: Number(form.price),
        beer_kind: form.beer_kind || null,
        alcohol_content: form.alcohol_content ? Number(form.alcohol_content) : null,
        container_kind: form.container_kind || null,
        volume_liters: form.volume_liters ? Number(form.volume_liters) : null,
        brand_id: form.brand_id ? Number(form.brand_id) : null,
        country_of_origin: form.country_of_origin || null,
        description: form.description || null,
      };
      const res = await createBeerAdmin(payload);
      alert(`✅ Beer created successfully! ID: ${res.beer_id}`);
      setCreatedBeerId(res.beer_id);
      setForm({ name: "", price: "", beer_kind: "", alcohol_content: "", container_kind: "", volume_liters: "", brand_id: "", country_of_origin: "", description: "" });
      if (onCreated) onCreated(res);
    } catch (err) {
      console.error(err);
      alert("❌ Error creating beer: " + (err.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetchEnum('beer', 'container_kind');
        if (mounted && res && res.values) setContainerOptions(res.values);
      } catch (e) {
        // ignore
      }
    })();
    return () => (mounted = false);
  }, []);

  return (
    <>
      <form onSubmit={handleSubmit} className={className} style={{ display: "grid", gap: "15px", maxWidth: "500px", margin: "0 auto" }}>
        <div>
          <label style={{ display: "block", marginBottom: "5px", color: "#2c3e50", fontWeight: "bold" }}>🍺 Beer Name *</label>
          <input name="name" placeholder="Enter beer name" value={form.name} onChange={handleChange} style={{ width: "100%", padding: "10px", border: "2px solid #ecf0f1", borderRadius: "8px", fontSize: "1rem" }} required />
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "5px", color: "#2c3e50", fontWeight: "bold" }}>🌍 Country of Origin</label>
          <input name="country_of_origin" placeholder="e.g., Ireland, Germany" value={form.country_of_origin} onChange={handleChange} style={{ width: "100%", padding: "10px", border: "2px solid #ecf0f1", borderRadius: "8px", fontSize: "1rem" }} />
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "5px", color: "#2c3e50", fontWeight: "bold" }}>📝 Description</label>
          <textarea name="description" placeholder="Enter beer description" value={form.description} onChange={handleChange} style={{ width: "100%", padding: "10px", border: "2px solid #ecf0f1", borderRadius: "8px", fontSize: "1rem", minHeight: "80px", resize: "vertical" }} />
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "5px", color: "#2c3e50", fontWeight: "bold" }}>💰 Price (€) *</label>
          <input name="price" type="number" step="0.01" placeholder="0.00" value={form.price} onChange={handleChange} style={{ width: "100%", padding: "10px", border: "2px solid #ecf0f1", borderRadius: "8px", fontSize: "1rem" }} required />
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "5px", color: "#2c3e50", fontWeight: "bold" }}>🍻 Beer Type</label>
          <input name="beer_kind" placeholder="e.g., lager, ale, stout" value={form.beer_kind} onChange={handleChange} style={{ width: "100%", padding: "10px", border: "2px solid #ecf0f1", borderRadius: "8px", fontSize: "1rem" }} />
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "5px", color: "#2c3e50", fontWeight: "bold" }}>🍺 Alcohol Content (%)</label>
          <input name="alcohol_content" type="number" step="0.1" placeholder="0.0" value={form.alcohol_content} onChange={handleChange} style={{ width: "100%", padding: "10px", border: "2px solid #ecf0f1", borderRadius: "8px", fontSize: "1rem" }} />
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
          <input name="volume_liters" type="number" step="0.1" placeholder="0.0" value={form.volume_liters} onChange={handleChange} style={{ width: "100%", padding: "10px", border: "2px solid #ecf0f1", borderRadius: "8px", fontSize: "1rem" }} />
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "5px", color: "#2c3e50", fontWeight: "bold" }}>🏷️ Brand ID</label>
          <input name="brand_id" placeholder="Enter brand ID" value={form.brand_id} onChange={handleChange} style={{ width: "100%", padding: "10px", border: "2px solid #ecf0f1", borderRadius: "8px", fontSize: "1rem" }} />
        </div>

        <button type="submit" disabled={loading} style={{ padding: "15px 30px", background: loading ? "#95a5a6" : "linear-gradient(45deg, #27ae60, #229954)", color: "white", border: "none", borderRadius: "8px", fontSize: "1.1rem", fontWeight: "bold", cursor: loading ? "not-allowed" : "pointer", boxShadow: "0 4px 15px rgba(39, 174, 96, 0.3)", transition: "transform 0.2s", marginTop: "10px" }}>
          {loading ? "🔄 Creating Beer..." : "🍺 Create Beer"}
        </button>
      </form>

      {createdBeerId && (
        <div style={{ maxWidth: "500px", margin: "0 auto", marginTop: "30px", padding: "20px", background: "#f0f8ff", borderRadius: "8px", border: "2px solid #3498db" }}>
          <h3 style={{ color: "#2c3e50", marginBottom: "15px" }}>📷 Add Photo (Optional)</h3>
          <UploadImageForm 
            beerId={createdBeerId} 
            onUploaded={() => {
              setTimeout(() => {
                setCreatedBeerId(null);
                navigate(`/beers/${createdBeerId}`);
              }, 1500);
            }}
          />
        </div>
      )}
    </>
  );
}
