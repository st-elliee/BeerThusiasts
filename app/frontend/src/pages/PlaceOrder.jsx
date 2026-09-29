import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { fetchBeers, fetchSuppliersForBrand, placeSupplierOrder, fetchPubs } from "../api/beer";

export default function PlaceOrder() {
  const [searchParams] = useSearchParams();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ pub_id: "", beer_id: "", supplier_id: "", quantity: "" });
  const [beers, setBeers] = useState([]);
  const [pubs, setPubs] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [failedImages, setFailedImages] = useState(new Set());

  useEffect(() => {
    const loadData = async () => {
      try {
        const [beerData, pubData] = await Promise.all([
          fetchBeers(),
          fetchPubs()
        ]);
        // Sort beers by ID in ascending order
        const sortedBeers = (beerData || []).sort((a, b) => a.beer_id - b.beer_id);
        setBeers(sortedBeers);
        setPubs(pubData || []);

        // Pre-fill form with query parameters if present (only on initial load)
        const pubId = searchParams.get('pub_id');
        const beerId = searchParams.get('beer_id');
        if (pubId) {
          setForm((s) => ({ ...s, pub_id: parseInt(pubId) }));
        }
        if (beerId) {
          setForm((s) => ({ ...s, beer_id: parseInt(beerId) }));
        }
      } catch (err) {
        console.error('Failed to load data', err);
        alert('❌ Failed to load data');
      }
    };
    loadData();
  }, [searchParams]);

  // Load suppliers when beer_id changes
  useEffect(() => {
    if (form.beer_id && beers.length > 0) {
      const selectedBeer = beers.find(b => b.beer_id === form.beer_id);
      if (selectedBeer) {
        const loadSuppliers = async () => {
          try {
            const supplierData = await fetchSuppliersForBrand(selectedBeer.brand_id);
            setSuppliers(supplierData || []);
          } catch (err) {
            console.error('Failed to load suppliers', err);
            setSuppliers([]);
          }
        };
        loadSuppliers();
      }
    }
  }, [form.beer_id, beers]);

  const handleChange = (e) => setForm((s) => ({ ...s, [e.target.name]: e.target.value }));

  const nextStep = () => setStep((s) => s + 1);
  const prevStep = () => setStep((s) => s - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const selectedBeer = beers.find(b => b.beer_id === form.beer_id);
      const selectedSupplier = suppliers.find(s => s.supplier_id === form.supplier_id);
      const selectedPub = pubs.find(p => p.pub_id === form.pub_id);

      if (!selectedBeer || !selectedSupplier || !selectedPub) {
        alert('❌ Invalid selection');
        return;
      }

      const orderData = {
        pub_id: parseInt(form.pub_id),
        supplier_id: selectedSupplier.supplier_id,
        beer_id: selectedBeer.beer_id,
        quantity: parseInt(form.quantity),
        supply_price: parseFloat(selectedSupplier.supply_price)
      };

      const result = await placeSupplierOrder(orderData);
      alert('✅ Order placed successfully!');
      console.log('Order result:', result);

      // Reset form
      setForm({ pub_id: "", beer_id: "", supplier_id: "", quantity: "" });
      setStep(1);
      setSuppliers([]);
    } catch (err) {
      console.error('Failed to place order:', err);
      alert('❌ Failed to place order: ' + (err.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const selectedBeer = beers.find(b => b.beer_id === form.beer_id);
  const selectedSupplier = suppliers.find(s => s.supplier_id === form.supplier_id);
  const selectedPub = pubs.find(p => p.pub_id === form.pub_id);

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div>
            <h3 style={{ color: "#2c3e50", marginBottom: "20px" }}>🏪 Select Pub to Order For</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "15px", maxHeight: "400px", overflowY: "auto" }}>
              {pubs.map((pub) => (
                <div
                  key={pub.pub_id}
                  onClick={() => setForm((s) => ({ ...s, pub_id: pub.pub_id }))}
                  style={{
                    border: form.pub_id === pub.pub_id ? "2px solid #3498db" : "1px solid #ddd",
                    borderRadius: "8px",
                    padding: "15px",
                    cursor: "pointer",
                    background: form.pub_id === pub.pub_id ? "#e8f4fd" : "white",
                    transition: "all 0.2s ease",
                    boxShadow: form.pub_id === pub.pub_id ? "0 2px 8px rgba(52, 152, 219, 0.2)" : "0 1px 3px rgba(0,0,0,0.1)"
                  }}
                  onMouseOver={(e) => {
                    if (form.pub_id !== pub.pub_id) {
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
                    }
                  }}
                  onMouseOut={(e) => {
                    if (form.pub_id !== pub.pub_id) {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.1)";
                    }
                  }}
                >
                  <div style={{ fontWeight: "bold", fontSize: "1.2rem", marginBottom: "10px", color: "#2c3e50" }}>{pub.name} (id {pub.pub_id})</div>
                  <div style={{ color: "#555", fontSize: "0.95rem", lineHeight: "1.6" }}>
                    <div>📍 {pub.city}, {pub.country}</div>
                    <div>🏠 {pub.street || pub.address || "N/A"}</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: "20px", textAlign: "right" }}>
              <button type="button" onClick={nextStep} disabled={!form.pub_id} style={{ padding: "10px 20px", background: form.pub_id ? "linear-gradient(45deg, #3498db, #2980b9)" : "#95a5a6", color: "white", border: "none", borderRadius: "8px", fontSize: "1rem" }}>Next →</button>
            </div>
          </div>
        );
      case 2:
        return (
          <div>
            <h3 style={{ color: "#2c3e50", marginBottom: "20px" }}>🍺 Select Beer to Order</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "15px", maxHeight: "400px", overflowY: "auto" }}>
              {beers.map((beer) => (
                <div
                  key={beer.beer_id}
                  onClick={() => setForm((s) => ({ ...s, beer_id: beer.beer_id, supplier_id: "" }))}
                  style={{
                    border: form.beer_id === beer.beer_id ? "2px solid #3498db" : "1px solid #ddd",
                    borderRadius: "8px",
                    padding: "15px",
                    cursor: "pointer",
                    background: form.beer_id === beer.beer_id ? "#e8f4fd" : "white",
                    transition: "all 0.2s ease",
                    boxShadow: form.beer_id === beer.beer_id ? "0 2px 8px rgba(52, 152, 219, 0.2)" : "0 1px 3px rgba(0,0,0,0.1)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center"
                  }}
                  onMouseOver={(e) => {
                    if (form.beer_id !== beer.beer_id) {
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
                    }
                  }}
                  onMouseOut={(e) => {
                    if (form.beer_id !== beer.beer_id) {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.1)";
                    }
                  }}
                >
                  <div
                    style={{
                      width: "80px",
                      height: "120px",
                      marginBottom: "10px",
                      fontSize: "50px",
                      lineHeight: "120px",
                      textAlign: "center"
                    }}
                  >
                    {failedImages.has(beer.beer_id) ? (
                      <span>🍺</span>
                    ) : (
                      <img 
                        src={`http://localhost:5001/images/beers/${beer.beer_id}.jpg`} 
                        alt={beer.name}
                        style={{
                          width: "80px",
                          height: "120px",
                          objectFit: "contain"
                        }}
                        onError={() => {
                          setFailedImages(prev => new Set(prev).add(beer.beer_id));
                        }}
                      />
                    )}
                  </div>
                  <div style={{ fontWeight: "bold", fontSize: "1.1rem", marginBottom: "5px", color: "#2c3e50" }}>
                    {beer.name || beer.beer_name}
                  </div>
                  <div style={{ color: "#7f8c8d", fontSize: "0.9rem" }}>
                    ID: {beer.beer_id}
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: "20px", display: "flex", justifyContent: "space-between" }}>
              <button type="button" onClick={prevStep} style={{ padding: "10px 20px", background: "#95a5a6", color: "white", border: "none", borderRadius: "8px" }}>← Back</button>
              <button type="button" onClick={nextStep} disabled={!form.beer_id} style={{ padding: "10px 20px", background: form.beer_id ? "linear-gradient(45deg, #3498db, #2980b9)" : "#95a5a6", color: "white", border: "none", borderRadius: "8px", fontSize: "1rem" }}>Next →</button>
            </div>
          </div>
        );
      case 3:
        return (
          <div>
            <h3 style={{ color: "#2c3e50", marginBottom: "20px" }}>🏭 Select Supplier {selectedBeer?.name}</h3>
            {suppliers.length === 0 ? (
              <div style={{ textAlign: "center", padding: "20px", color: "#7f8c8d" }}>
                Loading suppliers...
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", gap: "15px", maxHeight: "400px", overflowY: "auto" }}>
                {suppliers.map((supplier) => (
                  <div
                    key={supplier.supplier_id}
                    onClick={() => setForm((s) => ({ ...s, supplier_id: supplier.supplier_id }))}
                    style={{
                      border: form.supplier_id === supplier.supplier_id ? "2px solid #27ae60" : "1px solid #ddd",
                      borderRadius: "8px",
                      padding: "15px",
                      cursor: "pointer",
                      background: form.supplier_id === supplier.supplier_id ? "#e8f8e8" : "white",
                      transition: "all 0.2s ease",
                      boxShadow: form.supplier_id === supplier.supplier_id ? "0 2px 8px rgba(39, 174, 96, 0.2)" : "0 1px 3px rgba(0,0,0,0.1)"
                    }}
                    onMouseOver={(e) => {
                      if (form.supplier_id !== supplier.supplier_id) {
                        e.currentTarget.style.transform = "translateY(-2px)";
                        e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
                      }
                    }}
                    onMouseOut={(e) => {
                      if (form.supplier_id !== supplier.supplier_id) {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.1)";
                      }
                    }}
                  >
                    <div style={{ fontWeight: "bold", fontSize: "1.2rem", marginBottom: "10px", color: "#2c3e50" }}>
                      {supplier.name}
                    </div>
                    <div style={{ color: "#555", fontSize: "0.95rem", lineHeight: "1.6" }}>
                      <div>👤 {supplier.contact_person}</div>
                      <div>📧 {supplier.email}</div>
                      <div>📞 {supplier.phone}</div>
                      <div>📍 {supplier.city}, {supplier.country}</div>
                      <div style={{ color: "#27ae60", fontWeight: "bold", marginTop: "8px", fontSize: "1rem" }}>
                        💰 ${supplier.supply_price}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div style={{ marginTop: "20px", display: "flex", justifyContent: "space-between" }}>
              <button type="button" onClick={prevStep} style={{ padding: "10px 20px", background: "#95a5a6", color: "white", border: "none", borderRadius: "8px" }}>← Back</button>
              <button type="button" onClick={nextStep} disabled={!form.supplier_id} style={{ padding: "10px 20px", background: form.supplier_id ? "linear-gradient(45deg, #3498db, #2980b9)" : "#95a5a6", color: "white", border: "none", borderRadius: "8px", fontSize: "1rem" }}>Next →</button>
            </div>
          </div>
        );
      case 4:
        return (
          <div>
            <h3 style={{ color: "#2c3e50", marginBottom: "20px" }}>📦 Order Details</h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", alignItems: "center", marginBottom: "20px" }}>
              <div style={{ flex: "1", minWidth: "200px" }}>
                <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
                  Quantity:
                </label>
                <input
                  name="quantity"
                  type="number"
                  min="1"
                  placeholder="Enter quantity"
                  value={form.quantity}
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    padding: "8px",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                    fontSize: "1rem"
                  }}
                  required
                />
              </div>

              <div style={{ flex: "1", minWidth: "200px", background: "#ecf0f1", padding: "15px", borderRadius: "8px" }}>
                <div style={{ fontWeight: "bold", marginBottom: "10px" }}>Order Summary:</div>
                <div style={{ marginBottom: "5px" }}>Pub: {selectedPub?.name} (id {selectedPub?.pub_id})</div>
                <div style={{ marginBottom: "5px" }}>Beer: {selectedBeer?.name} (id {selectedBeer?.beer_id})</div>
                <div style={{ marginBottom: "5px" }}>Supplier: {selectedSupplier?.name}</div>
                <div style={{ marginBottom: "5px" }}>Unit Price: ${selectedSupplier?.supply_price}</div>
                <div style={{ marginBottom: "5px" }}>Quantity: {form.quantity}</div>
                <div style={{ fontWeight: "bold", fontSize: "1.1rem", color: "#e74c3c" }}>
                  Total: ${(selectedSupplier?.supply_price * form.quantity).toFixed(2)}
                </div>
              </div>
            </div>
            <div style={{ marginTop: "20px", display: "flex", justifyContent: "space-between" }}>
              <button type="button" onClick={prevStep} style={{ padding: "10px 20px", background: "#95a5a6", color: "white", border: "none", borderRadius: "8px" }}>← Back</button>
              <button type="submit" disabled={loading || !form.quantity} style={{ padding: "10px 20px", background: loading || !form.quantity ? "#95a5a6" : "linear-gradient(45deg, #27ae60, #229954)", color: "white", border: "none", borderRadius: "8px", fontSize: "1rem" }}>
                {loading ? "📦 Placing Order..." : "📦 Place Order"}
              </button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="page-transition" style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      <h1 style={{ color: "#2c3e50", marginBottom: "30px", textAlign: "center" }}>
        🛒 Place Supplier Order
      </h1>

      <form onSubmit={handleSubmit} style={{ background: "#f8f9fa", padding: "30px", borderRadius: "15px", boxShadow: "0 8px 25px rgba(0,0,0,0.1)" }}>
        <div style={{ marginBottom: "30px" }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
            {[1, 2, 3, 4].map((s) => (
              <div key={s} style={{
                width: "50px",
                height: "50px",
                borderRadius: "50%",
                background: s <= step ? "#3498db" : "#ecf0f1",
                color: s <= step ? "white" : "#7f8c8d",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "bold",
                margin: "0 10px",
                transition: "all 0.3s ease"
              }}>
                {s}
              </div>
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "10px" }}>
            <div style={{ width: "75%", height: "4px", background: "#ecf0f1", borderRadius: "2px", position: "relative" }}>
              <div style={{
                height: "100%",
                background: "#3498db",
                borderRadius: "2px",
                width: `${((step - 1) / 3) * 100}%`,
                transition: "width 0.3s ease"
              }}></div>
            </div>
          </div>
        </div>
        {renderStep()}
      </form>
    </div>
  );
}