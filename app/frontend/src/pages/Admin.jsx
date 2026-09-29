import React, { useCallback, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { upsertPubHasBeerAdmin, fetchPubsNeedsRestock, fetchBeers, createPub, fetchPubs, updatePub, fetchInventory, updateInventory } from "../api/beer";
import PlaceOrder from "./PlaceOrder";
import AdminSupplierOrders from "./AdminSupplierOrders";
import Employees from "./Employees";

// Restock Alert Component
function RestockAlert({ onNavigateToRestock }) {
  const [restockCount, setRestockCount] = useState(0);
  const [showAlert, setShowAlert] = useState(false);

  const checkRestock = useCallback(async () => {
    try {
      const data = await fetchPubsNeedsRestock();
      const count = data ? data.length : 0;
      setRestockCount(count);
      setShowAlert(count > 0);
    } catch (err) {
      console.error('Failed to check restock status', err);
    }
  }, []);

  useEffect(() => {
    // Check immediately
    checkRestock();
    
    // Check every 30 seconds
    const interval = setInterval(checkRestock, 30000);
    
    return () => clearInterval(interval);
  }, [checkRestock]);

  if (!showAlert) return null;

  return (
    <>
      <style>
        {`
          @keyframes slideInRight {
            from {
              transform: translateX(100%);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }
        `}
      </style>
      <div style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        background: 'linear-gradient(45deg, #e74c3c, #c0392b)',
        color: 'white',
        padding: '15px 20px',
        borderRadius: '10px',
        boxShadow: '0 4px 15px rgba(231, 76, 60, 0.4)',
        cursor: 'pointer',
        zIndex: 1000,
        animation: 'slideInRight 0.5s ease-out',
        maxWidth: '300px',
        transition: 'all 0.2s ease'
      }}
      onClick={() => {
        setShowAlert(false);
        onNavigateToRestock();
      }}
      onMouseOver={(e) => {
        e.target.style.transform = 'translateY(-2px)';
        e.target.style.boxShadow = '0 6px 20px rgba(231, 76, 60, 0.5)';
      }}
      onMouseOut={(e) => {
        e.target.style.transform = 'translateY(0)';
        e.target.style.boxShadow = '0 4px 15px rgba(231, 76, 60, 0.4)';
      }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
          <div style={{ fontSize: '1.5rem' }}>⚠️</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 'bold', fontSize: '1rem' }}>Restock Alert!</div>
            <div style={{ fontSize: '0.9rem', marginTop: '2px' }}>
              {restockCount} item{restockCount !== 1 ? 's' : ''} need{restockCount === 1 ? 's' : ''} restocking
            </div>
            <div style={{ fontSize: '0.8rem', marginTop: '8px', opacity: 0.9 }}>
              Click to manage restock →
            </div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowAlert(false);
            }}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              fontSize: '1.2rem',
              padding: '0',
              opacity: 0.7,
              transition: 'opacity 0.2s'
            }}
            onMouseOver={(e) => e.target.style.opacity = '1'}
            onMouseOut={(e) => e.target.style.opacity = '0.7'}
            title="Dismiss alert"
          >
            ×
          </button>
        </div>
        <div
          style={{
            width: '100%',
            height: '3px',
            background: 'rgba(255, 255, 255, 0.3)',
            borderRadius: '2px',
            marginTop: '10px',
            position: 'relative',
            overflow: 'hidden',
            cursor: 'pointer'
          }}
          onClick={() => {
            setShowAlert(false);
            onNavigateToRestock();
          }}
        >
          <div
            style={{
              height: '100%',
              background: 'white',
              borderRadius: '2px',
              animation: 'progressBar 30s linear infinite'
            }}
          />
        </div>
        <style>
          {`
            @keyframes progressBar {
              from { width: 100%; }
              to { width: 0%; }
            }
          `}
        </style>
      </div>
    </>
  );
}

export default function Admin() {
  const navigate = useNavigate();
  const logout = useCallback(() => {
    localStorage.removeItem("role");
    navigate("/");
  }, [navigate]);

  const role = localStorage.getItem("role");
  const [active, setActive] = useState("menu");

  const handleNavigateToRestock = useCallback(() => {
    setActive('restock');
  }, []);

  if (role !== "admin") {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)", padding: "20px" }}>
        <div style={{ background: "rgba(255, 255, 255, 0.95)", padding: "40px", borderRadius: "15px", boxShadow: "0 8px 25px rgba(0,0,0,0.1)", textAlign: "center", maxWidth: "400px" }}>
          <h2 style={{ color: "#e74c3c", marginBottom: "20px" }}>🚫 Access Denied</h2>
          <p style={{ color: "#7f8c8d", marginBottom: "30px" }}>You must enter as Admin to view this page.</p>
          <button onClick={() => navigate("/")} style={{ padding: "12px 25px", background: "linear-gradient(45deg, #3498db, #2980b9)", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "1rem", boxShadow: "0 4px 15px rgba(52, 152, 219, 0.3)" }}>Go to Home</button>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    if (active === 'beers') return (
      <div style={{ background: "rgba(255,255,255,0.95)", borderRadius: "15px", padding: "30px", boxShadow: "0 8px 25px rgba(0,0,0,0.1)" }}>
        <button onClick={() => setActive('menu')} style={{ padding: "8px 15px", background: "#95a5a6", color: "white", border: "none", borderRadius: "5px", cursor: "pointer", marginBottom: "20px" }}>← Back to Menu</button>
        <h2 style={{ color: "#2c3e50", marginBottom: "20px", textAlign: "center" }}>🍺 Manage Beers</h2>
        <BeersList />
      </div>
    );

    if (active === 'manage-pubs') return (
      <div style={{ background: "rgba(255,255,255,0.95)", borderRadius: "15px", padding: "30px", boxShadow: "0 8px 25px rgba(0,0,0,0.1)" }}>
        <button onClick={() => setActive('menu')} style={{ padding: "8px 15px", background: "#95a5a6", color: "white", border: "none", borderRadius: "5px", cursor: "pointer", marginBottom: "20px" }}>← Back to Menu</button>
        <h2 style={{ color: "#2c3e50", marginBottom: "20px", textAlign: "center" }}>🏪 Manage Pubs</h2>
        <PubsList />
      </div>
    );

    if (active === 'orders') return (
      <div style={{ background: "rgba(255,255,255,0.95)", borderRadius: "15px", padding: "30px", boxShadow: "0 8px 25px rgba(0,0,0,0.1)" }}>
        <button onClick={() => setActive('menu')} style={{ padding: "8px 15px", background: "#95a5a6", color: "white", border: "none", borderRadius: "5px", cursor: "pointer", marginBottom: "20px" }}>← Back to Menu</button>
        <PlaceOrder />
      </div>
    );

    if (active === 'inventory') return (
      <div style={{ background: "rgba(255, 255, 255, 0.95)", borderRadius: "15px", padding: "30px", boxShadow: "0 8px 25px rgba(0,0,0,0.1)" }}>
        <button onClick={() => setActive('menu')} style={{ padding: "8px 15px", background: "#95a5a6", color: "white", border: "none", borderRadius: "5px", cursor: "pointer", marginBottom: "20px" }}>← Back to Menu</button>
        <h2 style={{ color: "#2c3e50", marginBottom: "20px", textAlign: "center" }}>📦 Update Pub Inventory</h2>
        <PubHasBeerForm />
      </div>
    );

    if (active === 'restock') return (
      <div style={{ background: "rgba(255, 255, 255, 0.95)", borderRadius: "15px", padding: "30px", boxShadow: "0 8px 25px rgba(0,0,0,0.1)" }}>
        <button onClick={() => setActive('menu')} style={{ padding: "8px 15px", background: "#95a5a6", color: "white", border: "none", borderRadius: "5px", cursor: "pointer", marginBottom: "20px" }}>← Back to Menu</button>
        <h2 style={{ color: "#2c3e50", marginBottom: "20px", textAlign: "center" }}>🔄 Restock Management</h2>
        <RestockPanel />
      </div>
    );

    if (active === 'employees') return (
      <div style={{ background: "rgba(255, 255, 255, 0.95)", borderRadius: "15px", padding: "30px", boxShadow: "0 8px 25px rgba(0,0,0,0.1)" }}>
        <button onClick={() => setActive('menu')} style={{ padding: "8px 15px", background: "#95a5a6", color: "white", border: "none", borderRadius: "5px", cursor: "pointer", marginBottom: "20px" }}>← Back to Menu</button>
        <Employees />
      </div>
    );
    if (active === 'supplier-orders') return (
      <div style={{ background: "rgba(255,255,255,0.95)", borderRadius: "15px", padding: "30px", boxShadow: "0 8px 25px rgba(0,0,0,0.1)" }}>
        <button onClick={() => setActive('menu')} style={{ padding: "8px 15px", background: "#95a5a6", color: "white", border: "none", borderRadius: "5px", cursor: "pointer", marginBottom: "20px" }}>← Back to Menu</button>
        <AdminSupplierOrders />
      </div>
    );
    if (active === 'add-pub') return (
      <div style={{ background: "rgba(255, 255, 255, 0.95)", borderRadius: "15px", padding: "30px", boxShadow: "0 8px 25px rgba(0,0,0,0.1)" }}>
        <button onClick={() => setActive('menu')} style={{ padding: "8px 15px", background: "#95a5a6", color: "white", border: "none", borderRadius: "5px", cursor: "pointer", marginBottom: "20px" }}>← Back to Menu</button>
        <h2 style={{ color: "#2c3e50", marginBottom: "20px", textAlign: "center" }}>🏪 Add New Pub</h2>
        <AddPubForm onSuccess={() => setActive('menu')} />
      </div>
    );
    if (active === 'manage-inventory') return (
      <div style={{ background: "rgba(255, 255, 255, 0.95)", borderRadius: "15px", padding: "30px", boxShadow: "0 8px 25px rgba(0,0,0,0.1)" }}>
        <button onClick={() => setActive('menu')} style={{ padding: "8px 15px", background: "#95a5a6", color: "white", border: "none", borderRadius: "5px", cursor: "pointer", marginBottom: "20px" }}>← Back to Menu</button>
        <InventoryList />
      </div>
    );
    return (
      <div style={{ background: "rgba(255, 255, 255, 0.95)", borderRadius: "15px", padding: "40px", boxShadow: "0 8px 25px rgba(0,0,0,0.1)", textAlign: "center" }}>
        <h1 style={{ color: "#2c3e50", marginBottom: "10px", fontSize: "2.5rem" }}>⚙️ Admin Panel</h1>
        <p style={{ color: "#7f8c8d", marginBottom: "40px", fontSize: "1.1rem" }}>Choose an admin tool to manage your beer inventory</p>
        <div style={{ display: "flex", gap: "20px", justifyContent: "center", flexWrap: "wrap" }}>
          <button onClick={() => navigate('/admin/beers')} style={{ padding: "20px 30px", background: "linear-gradient(45deg, #f39c12, #e67e22)", color: "white", border: "none", borderRadius: "10px", cursor: "pointer", fontSize: "1.1rem", fontWeight: "bold", minWidth: "200px" }}>🍺 Manage Beers</button>
          <button onClick={() => setActive('manage-pubs')} style={{ padding: "20px 30px", background: "linear-gradient(45deg, #ff6b6b, #ee5a6f)", color: "white", border: "none", borderRadius: "10px", cursor: "pointer", fontSize: "1.1rem", fontWeight: "bold", minWidth: "200px" }}>🏪 Manage Pubs</button>
          <button onClick={() => setActive('manage-inventory')} style={{ padding: "20px 30px", background: "linear-gradient(45deg, #8e44ad, #9b59b6)", color: "white", border: "none", borderRadius: "10px", cursor: "pointer", fontSize: "1.1rem", fontWeight: "bold", minWidth: "200px" }}>📦 Manage Inventory</button>
          <button onClick={() => setActive('restock')} style={{ padding: "20px 30px", background: "linear-gradient(45deg, #e67e22, #d35400)", color: "white", border: "none", borderRadius: "10px", cursor: "pointer", fontSize: "1.1rem", fontWeight: "bold", minWidth: "200px" }}>🔄 Check Restock</button>
          <button onClick={() => setActive('employees')} style={{ padding: "20px 30px", background: "linear-gradient(45deg, #9b59b6, #8e44ad)", color: "white", border: "none", borderRadius: "10px", cursor: "pointer", fontSize: "1.1rem", fontWeight: "bold", minWidth: "200px" }}>👥 Company Records</button>
          <button onClick={() => setActive('supplier-orders')} style={{ padding: "20px 30px", background: "linear-gradient(45deg, #16a085, #1abc9c)", color: "white", border: "none", borderRadius: "10px", cursor: "pointer", fontSize: "1.1rem", fontWeight: "bold", minWidth: "200px" }}>📋 Manage Orders</button>
        </div>
      </div>
    );
  };

  return (
    <div className="page-transition" style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px", background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)", minHeight: "100vh" }}>
      <RestockAlert onNavigateToRestock={handleNavigateToRestock} />
      {renderContent()}
      <div style={{ textAlign: "center", marginTop: "30px" }}>
        <button onClick={logout} style={{ padding: "12px 25px", background: "linear-gradient(45deg, #e74c3c, #c0392b)", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "1rem" }}>🚪 Logout</button>
      </div>
    </div>
  );
}

function BeersList() {
  const navigate = useNavigate();
  const [beers, setBeers] = useState([]);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchBeers();
      setBeers(data || []);
    } catch (err) {
      console.error('Failed to fetch beers', err);
      alert('❌ Failed to fetch beers');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
        <button onClick={load} disabled={loading} style={{ padding: "10px 20px", background: loading ? "#95a5a6" : "linear-gradient(45deg, #3498db, #2980b9)", color: "white", border: "none", borderRadius: "8px" }}>{loading ? "🔄 Loading..." : "🔄 Refresh List"}</button>
      </div>

      {beers.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px", color: "#7f8c8d", background: "#f8f9fa", borderRadius: "10px" }}>
          <div style={{ fontSize: "3rem", marginBottom: "20px" }}>🍺</div>
          <h3>No beers found</h3>
          <p>Add some beers to get started.</p>
        </div>
      ) : (
        <div style={{ background: "white", borderRadius: "10px", overflow: "hidden", boxShadow: "0 4px 15px rgba(0,0,0,0.1)" }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: "0.9rem" }}>
            <thead>
              <tr style={{ background: "#2c3e50", color: "white" }}>
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: "bold", borderRight: "1px solid #34495e" }}>ID</th>
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: "bold", borderRight: "1px solid #34495e" }}>Name</th>
                <th style={{ padding: '12px', textAlign: 'right', fontWeight: "bold", borderRight: "1px solid #34495e" }}>Price</th>
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: "bold", borderRight: "1px solid #34495e" }}>Kind</th>
                <th style={{ padding: '12px', textAlign: 'center', fontWeight: "bold" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {beers.map((beer, idx) => (
                <tr key={beer.beer_id} style={{ background: idx % 2 === 0 ? "#f8f9fa" : "white" }}>
                  <td style={{ padding: '12px', borderRight: "1px solid #ecf0f1" }}>{beer.beer_id}</td>
                  <td style={{ padding: '12px', borderRight: "1px solid #ecf0f1" }}>{beer.name}</td>
                  <td style={{ padding: '12px', textAlign: 'right', borderRight: "1px solid #ecf0f1" }}>€{beer.price}</td>
                  <td style={{ padding: '12px', borderRight: "1px solid #ecf0f1" }}>{beer.beer_kind}</td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>
                    <button onClick={() => navigate(`/beers/${beer.beer_id}`)} style={{ padding: "6px 12px", background: "#3498db", color: "white", border: "none", borderRadius: "5px" }}>Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function PubsList() {
  const [pubs, setPubs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedPub, setSelectedPub] = useState(null);
  const [editingPub, setEditingPub] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchPubs();
      setPubs(data || []);
    } catch (err) {
      console.error('Failed to fetch pubs', err);
      alert('❌ Failed to fetch pubs');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  return (
    <div>
      {showAddForm ? (
        <div>
          <button 
            onClick={() => setShowAddForm(false)}
            style={{ 
              padding: "8px 15px", 
              background: "#95a5a6", 
              color: "white", 
              border: "none", 
              borderRadius: "5px", 
              cursor: "pointer", 
              marginBottom: "20px" 
            }}
          >
            ← Back to List
          </button>
          <h2 style={{ color: "#2c3e50", marginBottom: "20px", textAlign: "center" }}>🏪 Add New Pub</h2>
          <AddPubForm onSuccess={() => { setShowAddForm(false); load(); }} />
        </div>
      ) : (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "10px" }}>
            <button 
              onClick={() => setShowAddForm(true)}
              style={{ 
                padding: "10px 20px", 
                background: "linear-gradient(45deg, #27ae60, #229954)", 
                color: "white", 
                border: "none", 
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "bold"
              }}
            >
              ➕ Add New Pub
            </button>
            <button onClick={load} disabled={loading} style={{ padding: "10px 20px", background: loading ? "#95a5a6" : "linear-gradient(45deg, #3498db, #2980b9)", color: "white", border: "none", borderRadius: "8px" }}>{loading ? "🔄 Loading..." : "🔄 Refresh List"}</button>
          </div>

      {pubs.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px", color: "#7f8c8d", background: "#f8f9fa", borderRadius: "10px" }}>
          <div style={{ fontSize: "3rem", marginBottom: "20px" }}>🏪</div>
          <h3>No pubs found</h3>
          <p>Add some pubs to get started.</p>
        </div>
      ) : (
        <div style={{ background: "white", borderRadius: "10px", overflow: "hidden", boxShadow: "0 4px 15px rgba(0,0,0,0.1)" }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: "0.9rem" }}>
            <thead>
              <tr style={{ background: "#2c3e50", color: "white" }}>
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: "bold", borderRight: "1px solid #34495e" }}>ID</th>
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: "bold", borderRight: "1px solid #34495e" }}>Name</th>
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: "bold", borderRight: "1px solid #34495e" }}>Manager</th>
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: "bold", borderRight: "1px solid #34495e" }}>City</th>
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: "bold", borderRight: "1px solid #34495e" }}>Phone</th>
                <th style={{ padding: '12px', textAlign: 'center', fontWeight: "bold" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pubs.map((pub, idx) => (
                <tr key={pub.pub_id} style={{ background: idx % 2 === 0 ? "#f8f9fa" : "white" }}>
                  <td style={{ padding: '12px', borderRight: "1px solid #ecf0f1" }}>{pub.pub_id}</td>
                  <td style={{ padding: '12px', borderRight: "1px solid #ecf0f1", fontWeight: "bold" }}>{pub.name}</td>
                  <td style={{ padding: '12px', borderRight: "1px solid #ecf0f1" }}>{pub.manager_name || '—'}</td>
                  <td style={{ padding: '12px', borderRight: "1px solid #ecf0f1" }}>{pub.city || '—'}</td>
                  <td style={{ padding: '12px', borderRight: "1px solid #ecf0f1" }}>{pub.phone || '—'}</td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>
                    <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
                      <button 
                        onClick={() => setSelectedPub(pub)}
                        style={{ padding: "6px 12px", background: "#3498db", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}
                      >
                        View Details
                      </button>
                      <button 
                        onClick={() => setEditingPub(pub)}
                        style={{ padding: "6px 12px", background: "#27ae60", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}
                      >
                        Edit
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pub Details Modal */}
      {selectedPub && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0, 0, 0, 0.75)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1000,
          animation: "fadeIn 0.3s ease-out"
        }}
        onClick={() => setSelectedPub(null)}
        >
          <div style={{
            background: "white",
            borderRadius: "15px",
            padding: "30px",
            maxWidth: "600px",
            width: "90%",
            maxHeight: "80vh",
            overflow: "auto",
            boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
            animation: "slideIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
          }}
          onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "25px",
              borderBottom: "2px solid #ecf0f1",
              paddingBottom: "15px"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ fontSize: "2rem" }}>🏪</span>
                <h2 style={{ color: "#2c3e50", margin: 0, fontSize: "1.8rem" }}>{selectedPub.name}</h2>
              </div>
              <button
                onClick={() => setSelectedPub(null)}
                style={{
                  background: "transparent",
                  border: "none",
                  fontSize: "2rem",
                  cursor: "pointer",
                  color: "#7f8c8d",
                  lineHeight: "1",
                  padding: "0",
                  width: "30px",
                  height: "30px"
                }}
                onMouseOver={(e) => e.target.style.color = "#e74c3c"}
                onMouseOut={(e) => e.target.style.color = "#7f8c8d"}
              >
                ×
              </button>
            </div>

            {/* Pub Details */}
            <div style={{ display: "grid", gap: "20px" }}>
              <div>
                <label style={{ display: "block", color: "#7f8c8d", fontSize: "0.85rem", fontWeight: "bold", marginBottom: "5px" }}>
                  🆔 Pub ID
                </label>
                <div style={{ color: "#2c3e50", fontSize: "1.1rem", padding: "10px", background: "#f8f9fa", borderRadius: "8px" }}>
                  #{selectedPub.pub_id}
                </div>
              </div>

              {selectedPub.manager_name && (
                <div>
                  <label style={{ display: "block", color: "#7f8c8d", fontSize: "0.85rem", fontWeight: "bold", marginBottom: "5px" }}>
                    👤 Manager
                  </label>
                  <div style={{ color: "#2c3e50", fontSize: "1.1rem", padding: "10px", background: "#f8f9fa", borderRadius: "8px" }}>
                    {selectedPub.manager_name}
                  </div>
                </div>
              )}

              {(selectedPub.street || selectedPub.city || selectedPub.postal_code || selectedPub.country) && (
                <div>
                  <label style={{ display: "block", color: "#7f8c8d", fontSize: "0.85rem", fontWeight: "bold", marginBottom: "5px" }}>
                    📍 Address
                  </label>
                  <div style={{ color: "#2c3e50", fontSize: "1.1rem", padding: "10px", background: "#f8f9fa", borderRadius: "8px", lineHeight: "1.6" }}>
                    {selectedPub.street && <div>{selectedPub.street}</div>}
                    {(selectedPub.city || selectedPub.postal_code) && (
                      <div>
                        {[selectedPub.city, selectedPub.postal_code].filter(Boolean).join(', ')}
                      </div>
                    )}
                    {selectedPub.country && <div>{selectedPub.country}</div>}
                  </div>
                </div>
              )}

              {selectedPub.phone && (
                <div>
                  <label style={{ display: "block", color: "#7f8c8d", fontSize: "0.85rem", fontWeight: "bold", marginBottom: "5px" }}>
                    📞 Phone
                  </label>
                  <div style={{ color: "#2c3e50", fontSize: "1.1rem", padding: "10px", background: "#f8f9fa", borderRadius: "8px" }}>
                    <a href={`tel:${selectedPub.phone}`} style={{ color: "#3498db", textDecoration: "none" }}>
                      {selectedPub.phone}
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Close Button */}
            <button
              onClick={() => setSelectedPub(null)}
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
                marginTop: "25px",
                boxShadow: "0 4px 15px rgba(52, 152, 219, 0.3)",
                transition: "all 0.2s"
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
              Close
            </button>
          </div>

          <style>{`
            @keyframes fadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            @keyframes slideIn {
              0% {
                opacity: 0;
                transform: scale(0.8) translateY(30px);
              }
              100% {
                opacity: 1;
                transform: scale(1) translateY(0);
              }
            }
          `}</style>
        </div>
      )}

      {/* Edit Pub Modal */}
      {editingPub && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0, 0, 0, 0.75)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1000,
          animation: "fadeIn 0.3s ease-out"
        }}
        onClick={() => setEditingPub(null)}
        >
          <div style={{
            background: "white",
            borderRadius: "15px",
            padding: "30px",
            maxWidth: "600px",
            width: "90%",
            maxHeight: "80vh",
            overflow: "auto",
            boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
            animation: "slideIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
          }}
          onClick={(e) => e.stopPropagation()}
          >
            <EditPubForm 
              pub={editingPub} 
              onSuccess={(updatedPub) => {
                setPubs(pubs.map(p => p.pub_id === updatedPub.pub_id ? updatedPub : p));
                setEditingPub(null);
              }}
              onCancel={() => setEditingPub(null)}
            />
          </div>
        </div>
      )}
        </div>
      )}
    </div>
  );
}

function EditPubForm({ pub, onSuccess, onCancel }) {
  const [form, setForm] = useState({
    name: pub.name || "",
    manager_name: pub.manager_name || "",
    phone: pub.phone || "",
    street: pub.street || "",
    city: pub.city || "",
    postal_code: pub.postal_code || "",
    country: pub.country || ""
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm((s) => ({ ...s, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await updatePub(pub.pub_id, form);
      alert(`✅ Pub "${result.name}" updated successfully!`);
      if (onSuccess) onSuccess(result);
    } catch (err) {
      console.error(err);
      alert("❌ Error updating pub: " + (err.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Modal Header */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "25px",
        borderBottom: "2px solid #ecf0f1",
        paddingBottom: "15px"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "2rem" }}>✏️</span>
          <h2 style={{ color: "#2c3e50", margin: 0, fontSize: "1.8rem" }}>Edit Pub</h2>
        </div>
        <button
          onClick={onCancel}
          style={{
            background: "transparent",
            border: "none",
            fontSize: "2rem",
            cursor: "pointer",
            color: "#7f8c8d",
            lineHeight: "1",
            padding: "0",
            width: "30px",
            height: "30px"
          }}
          onMouseOver={(e) => e.target.style.color = "#e74c3c"}
          onMouseOut={(e) => e.target.style.color = "#7f8c8d"}
        >
          ×
        </button>
      </div>

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: "15px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
          <div style={{ gridColumn: "1 / -1" }}>
            <label style={{ display: "block", marginBottom: "5px", color: "#2c3e50", fontWeight: "bold" }}>🏪 Pub Name *</label>
            <input
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              style={{ width: "100%", padding: "12px", border: "2px solid #ecf0f1", borderRadius: "8px", fontSize: "1rem" }}
              required
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "5px", color: "#2c3e50", fontWeight: "bold" }}>👤 Manager Name</label>
            <input
              name="manager_name"
              type="text"
              value={form.manager_name}
              onChange={handleChange}
              style={{ width: "100%", padding: "12px", border: "2px solid #ecf0f1", borderRadius: "8px", fontSize: "1rem" }}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "5px", color: "#2c3e50", fontWeight: "bold" }}>📞 Phone</label>
            <input
              name="phone"
              type="tel"
              value={form.phone}
              onChange={handleChange}
              maxLength="15"
              style={{ width: "100%", padding: "12px", border: "2px solid #ecf0f1", borderRadius: "8px", fontSize: "1rem" }}
            />
          </div>

          <div style={{ gridColumn: "1 / -1" }}>
            <label style={{ display: "block", marginBottom: "5px", color: "#2c3e50", fontWeight: "bold" }}>📍 Street Address</label>
            <input
              name="street"
              type="text"
              value={form.street}
              onChange={handleChange}
              style={{ width: "100%", padding: "12px", border: "2px solid #ecf0f1", borderRadius: "8px", fontSize: "1rem" }}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "5px", color: "#2c3e50", fontWeight: "bold" }}>🏙️ City</label>
            <input
              name="city"
              type="text"
              value={form.city}
              onChange={handleChange}
              style={{ width: "100%", padding: "12px", border: "2px solid #ecf0f1", borderRadius: "8px", fontSize: "1rem" }}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "5px", color: "#2c3e50", fontWeight: "bold" }}>📮 Postal Code</label>
            <input
              name="postal_code"
              type="text"
              value={form.postal_code}
              onChange={handleChange}
              maxLength="12"
              style={{ width: "100%", padding: "12px", border: "2px solid #ecf0f1", borderRadius: "8px", fontSize: "1rem" }}
            />
          </div>

          <div style={{ gridColumn: "1 / -1" }}>
            <label style={{ display: "block", marginBottom: "5px", color: "#2c3e50", fontWeight: "bold" }}>🌍 Country</label>
            <input
              name="country"
              type="text"
              value={form.country}
              onChange={handleChange}
              style={{ width: "100%", padding: "12px", border: "2px solid #ecf0f1", borderRadius: "8px", fontSize: "1rem" }}
            />
          </div>
        </div>

        <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
          <button
            type="submit"
            disabled={loading}
            style={{
              flex: 1,
              padding: "15px 30px",
              background: loading ? "#95a5a6" : "linear-gradient(45deg, #27ae60, #229954)",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "1.1rem",
              fontWeight: "bold",
              cursor: loading ? "not-allowed" : "pointer",
              boxShadow: loading ? "none" : "0 4px 15px rgba(39, 174, 96, 0.3)",
              transition: "all 0.2s"
            }}
            onMouseOver={(e) => {
              if (!loading) e.target.style.transform = "translateY(-2px)";
            }}
            onMouseOut={(e) => {
              if (!loading) e.target.style.transform = "translateY(0)";
            }}
          >
            {loading ? "🔄 Saving..." : "💾 Save Changes"}
          </button>
          
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            style={{
              flex: 1,
              padding: "15px 30px",
              background: "#95a5a6",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "1.1rem",
              fontWeight: "bold",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "all 0.2s"
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

function InventoryList() {
  const navigate = useNavigate();
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInventory, setSelectedInventory] = useState(null);
  const [editingInventory, setEditingInventory] = useState(null);
  const [searchPubId, setSearchPubId] = useState("");
  const [searchBeerId, setSearchBeerId] = useState("");
  const [showUpdateForm, setShowUpdateForm] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const data = await fetchInventory();
      setInventory(data);
    } catch (err) {
      console.error(err);
      alert("Failed to load inventory");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  if (loading) return <p style={{ textAlign: "center", fontSize: "1.2rem", color: "#7f8c8d" }}>🔄 Loading inventory...</p>;

  const filteredInventory = inventory.filter(item => {
    const matchesPub = searchPubId === "" || item.pub_id.toString().includes(searchPubId);
    const matchesBeer = searchBeerId === "" || item.beer_id.toString().includes(searchBeerId);
    return matchesPub && matchesBeer;
  });

  return (
    <div>
      {showUpdateForm ? (
        <div>
          <button 
            onClick={() => setShowUpdateForm(false)}
            style={{ 
              padding: "8px 15px", 
              background: "#95a5a6", 
              color: "white", 
              border: "none", 
              borderRadius: "5px", 
              cursor: "pointer", 
              marginBottom: "20px" 
            }}
          >
            ← Back to List
          </button>
          <PubHasBeerForm onSuccess={() => { setShowUpdateForm(false); load(); }} />
        </div>
      ) : (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <h2 style={{ color: "#2c3e50", margin: 0, fontSize: "2rem" }}>📦 Manage Inventory</h2>
            <button 
              onClick={() => setShowUpdateForm(true)}
              style={{ 
                padding: "10px 20px", 
                background: "linear-gradient(45deg, #3498db, #2980b9)", 
                color: "white", 
                border: "none", 
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "bold"
              }}
            >
              📦 Update Inventory
            </button>
          </div>
      
      {/* Search Filters */}
      <div style={{
        display: "flex",
        gap: "15px",
        marginBottom: "25px",
        padding: "20px",
        background: "white",
        borderRadius: "10px",
        boxShadow: "0 4px 15px rgba(0,0,0,0.1)"
      }}>
        <div style={{ flex: 1 }}>
          <label style={{ display: "block", marginBottom: "8px", color: "#2c3e50", fontWeight: "bold" }}>🔍 Search by Pub ID</label>
          <input
            type="text"
            value={searchPubId}
            onChange={(e) => setSearchPubId(e.target.value)}
            placeholder="Enter pub ID..."
            style={{
              width: "100%",
              padding: "10px",
              border: "2px solid #ecf0f1",
              borderRadius: "8px",
              fontSize: "1rem"
            }}
          />
        </div>
        <div style={{ flex: 1 }}>
          <label style={{ display: "block", marginBottom: "8px", color: "#2c3e50", fontWeight: "bold" }}>🔍 Search by Beer ID</label>
          <input
            type="text"
            value={searchBeerId}
            onChange={(e) => setSearchBeerId(e.target.value)}
            placeholder="Enter beer ID..."
            style={{
              width: "100%",
              padding: "10px",
              border: "2px solid #ecf0f1",
              borderRadius: "8px",
              fontSize: "1rem"
            }}
          />
        </div>
        {(searchPubId || searchBeerId) && (
          <div style={{ display: "flex", alignItems: "flex-end" }}>
            <button
              onClick={() => {
                setSearchPubId("");
                setSearchBeerId("");
              }}
              style={{
                padding: "10px 20px",
                background: "#95a5a6",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "bold"
              }}
            >
              Clear
            </button>
          </div>
        )}
      </div>
      
      {filteredInventory.length === 0 ? (
        <p style={{ textAlign: "center", color: "#7f8c8d", fontSize: "1.1rem" }}>
          {inventory.length === 0 ? "No inventory entries found." : "No matching entries found."}
        </p>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{
            width: "100%",
            borderCollapse: "collapse",
            background: "white",
            borderRadius: "10px",
            overflow: "hidden",
            boxShadow: "0 4px 15px rgba(0,0,0,0.1)"
          }}>
            <thead>
              <tr style={{ background: "linear-gradient(45deg, #8e44ad, #9b59b6)", color: "white" }}>
                <th style={{ padding: "15px", textAlign: "left", fontWeight: "bold" }}>Pub</th>
                <th style={{ padding: "15px", textAlign: "left", fontWeight: "bold" }}>Beer</th>
                <th style={{ padding: "15px", textAlign: "center", fontWeight: "bold" }}>Quantity</th>
                <th style={{ padding: "15px", textAlign: "center", fontWeight: "bold" }}>Reorder Threshold</th>
                <th style={{ padding: "15px", textAlign: "left", fontWeight: "bold" }}>Storage</th>
                <th style={{ padding: "15px", textAlign: "center", fontWeight: "bold" }}>Last Updated</th>
                <th style={{ padding: "15px", textAlign: "center", fontWeight: "bold" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInventory.map((item, idx) => (
                <tr key={`${item.pub_id}-${item.beer_id}`} style={{
                  background: idx % 2 === 0 ? "#f8f9fa" : "white",
                  borderBottom: "1px solid #ecf0f1",
                  transition: "background 0.2s"
                }}
                onMouseOver={(e) => e.currentTarget.style.background = "#e8f4f8"}
                onMouseOut={(e) => e.currentTarget.style.background = idx % 2 === 0 ? "#f8f9fa" : "white"}
                >
                  <td style={{ padding: "12px", color: "#2c3e50" }}>
                    {item.pub_name} <span style={{ color: "#95a5a6", fontSize: "0.9rem" }}>({item.pub_id})</span>
                  </td>
                  <td style={{ padding: "12px", color: "#2c3e50" }}>
                    {item.beer_name} <span style={{ color: "#95a5a6", fontSize: "0.9rem" }}>({item.beer_id})</span>
                  </td>
                  <td style={{ padding: "12px", textAlign: "center", color: "#2c3e50", fontWeight: "bold" }}>{item.quantity_available}</td>
                  <td style={{ padding: "12px", textAlign: "center", color: "#e67e22", fontWeight: "bold" }}>{item.reorder_threshold || "—"}</td>
                  <td style={{ padding: "12px", color: "#7f8c8d" }}>{item.storage_location || "—"}</td>
                  <td style={{ padding: "12px", textAlign: "center", color: "#95a5a6", fontSize: "0.9rem" }}>
                    {new Date(item.last_updated).toLocaleDateString()}
                  </td>
                  <td style={{ padding: "12px", textAlign: "center" }}>
                    <button 
                      onClick={() => setSelectedInventory(item)}
                      style={{ 
                        padding: "6px 12px", 
                        background: "#3498db", 
                        color: "white", 
                        border: "none", 
                        borderRadius: "5px", 
                        cursor: "pointer",
                        marginRight: "5px",
                        fontSize: "0.9rem"
                      }}
                    >
                      Details
                    </button>
                    <button 
                      onClick={() => setEditingInventory(item)}
                      style={{ 
                        padding: "6px 12px", 
                        background: "#27ae60", 
                        color: "white", 
                        border: "none", 
                        borderRadius: "5px", 
                        cursor: "pointer",
                        marginRight: "5px",
                        fontSize: "0.9rem"
                      }}
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => navigate(`/place-order?pub_id=${item.pub_id}&beer_id=${item.beer_id}`)}
                      style={{ 
                        padding: "6px 12px", 
                        background: "#f39c12", 
                        color: "white", 
                        border: "none", 
                        borderRadius: "5px", 
                        cursor: "pointer",
                        fontSize: "0.9rem"
                      }}
                    >
                      Order
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* View Details Modal */}
      {selectedInventory && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0, 0, 0, 0.75)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1000,
          animation: "fadeIn 0.3s ease-out"
        }}
        onClick={() => setSelectedInventory(null)}
        >
          <div style={{
            background: "white",
            borderRadius: "15px",
            padding: "30px",
            maxWidth: "500px",
            width: "90%",
            boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
            animation: "slideIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
          }}
          onClick={(e) => e.stopPropagation()}
          >
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "25px",
              borderBottom: "2px solid #ecf0f1",
              paddingBottom: "15px"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ fontSize: "2rem" }}>📦</span>
                <h2 style={{ color: "#2c3e50", margin: 0, fontSize: "1.8rem" }}>Inventory Details</h2>
              </div>
              <button
                onClick={() => setSelectedInventory(null)}
                style={{
                  background: "transparent",
                  border: "none",
                  fontSize: "2rem",
                  cursor: "pointer",
                  color: "#7f8c8d",
                  lineHeight: "1",
                  padding: "0",
                  width: "30px",
                  height: "30px"
                }}
                onMouseOver={(e) => e.target.style.color = "#e74c3c"}
                onMouseOut={(e) => e.target.style.color = "#7f8c8d"}
              >
                ×
              </button>
            </div>

            <div style={{ display: "grid", gap: "15px" }}>
              <div style={{ padding: "12px", background: "#f8f9fa", borderRadius: "8px" }}>
                <div style={{ fontSize: "0.85rem", color: "#7f8c8d", marginBottom: "5px" }}>🏪 PUB</div>
                <div style={{ fontSize: "1.1rem", color: "#2c3e50", fontWeight: "bold" }}>{selectedInventory.pub_name}</div>
              </div>

              <div style={{ padding: "12px", background: "#f8f9fa", borderRadius: "8px" }}>
                <div style={{ fontSize: "0.85rem", color: "#7f8c8d", marginBottom: "5px" }}>🍺 BEER</div>
                <div style={{ fontSize: "1.1rem", color: "#2c3e50", fontWeight: "bold" }}>{selectedInventory.beer_name}</div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
                <div style={{ padding: "12px", background: "#e8f8f5", borderRadius: "8px" }}>
                  <div style={{ fontSize: "0.85rem", color: "#16a085", marginBottom: "5px" }}>📊 QUANTITY</div>
                  <div style={{ fontSize: "1.3rem", color: "#27ae60", fontWeight: "bold" }}>{selectedInventory.quantity_available}</div>
                </div>

                <div style={{ padding: "12px", background: "#fef5e7", borderRadius: "8px" }}>
                  <div style={{ fontSize: "0.85rem", color: "#d68910", marginBottom: "5px" }}>⚠️ THRESHOLD</div>
                  <div style={{ fontSize: "1.3rem", color: "#e67e22", fontWeight: "bold" }}>{selectedInventory.reorder_threshold || "—"}</div>
                </div>
              </div>

              <div style={{ padding: "12px", background: "#f8f9fa", borderRadius: "8px" }}>
                <div style={{ fontSize: "0.85rem", color: "#7f8c8d", marginBottom: "5px" }}>📍 STORAGE LOCATION</div>
                <div style={{ fontSize: "1.1rem", color: "#2c3e50" }}>{selectedInventory.storage_location || "Not specified"}</div>
              </div>

              <div style={{ padding: "12px", background: "#f8f9fa", borderRadius: "8px" }}>
                <div style={{ fontSize: "0.85rem", color: "#7f8c8d", marginBottom: "5px" }}>🕒 LAST UPDATED</div>
                <div style={{ fontSize: "1.1rem", color: "#2c3e50" }}>
                  {new Date(selectedInventory.last_updated).toLocaleString()}
                </div>
              </div>

              {selectedInventory.remaining_until_reorder !== null && selectedInventory.remaining_until_reorder !== undefined && (
                <div style={{ padding: "12px", background: "#fdecea", borderRadius: "8px" }}>
                  <div style={{ fontSize: "0.85rem", color: "#c0392b", marginBottom: "5px" }}>🔔 REMAINING UNTIL REORDER</div>
                  <div style={{ fontSize: "1.3rem", color: "#e74c3c", fontWeight: "bold" }}>{selectedInventory.remaining_until_reorder}</div>
                </div>
              )}
            </div>

            <button
              onClick={() => setSelectedInventory(null)}
              style={{
                marginTop: "25px",
                width: "100%",
                padding: "12px",
                background: "#95a5a6",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "1rem",
                fontWeight: "bold"
              }}
            >
              Close
            </button>
          </div>

          <style>{`
            @keyframes fadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            @keyframes slideIn {
              from { transform: scale(0.9) translateY(-20px); opacity: 0; }
              to { transform: scale(1) translateY(0); opacity: 1; }
            }
          `}</style>
        </div>
      )}

      {/* Edit Inventory Modal */}
      {editingInventory && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0, 0, 0, 0.75)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1000,
          animation: "fadeIn 0.3s ease-out"
        }}
        onClick={() => setEditingInventory(null)}
        >
          <div style={{
            background: "white",
            borderRadius: "15px",
            padding: "30px",
            maxWidth: "600px",
            width: "90%",
            maxHeight: "80vh",
            overflow: "auto",
            boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
            animation: "slideIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
          }}
          onClick={(e) => e.stopPropagation()}
          >
            <EditInventoryForm 
              inventory={editingInventory} 
              onSuccess={(updated) => {
                setInventory(inventory.map(i => 
                  (i.pub_id === updated.pub_id && i.beer_id === updated.beer_id) ? updated : i
                ));
                setEditingInventory(null);
              }}
              onCancel={() => setEditingInventory(null)}
            />
          </div>
        </div>
      )}
        </div>
      )}
    </div>
  );
}

function EditInventoryForm({ inventory, onSuccess, onCancel }) {
  const [form, setForm] = useState({
    quantity_available: inventory.quantity_available || 0,
    reorder_threshold: inventory.reorder_threshold || "",
    storage_location: inventory.storage_location || ""
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm((s) => ({ ...s, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await updateInventory(inventory.pub_id, inventory.beer_id, form);
      alert(`✅ Inventory updated successfully!`);
      if (onSuccess) onSuccess(result);
    } catch (err) {
      console.error(err);
      alert("❌ Error updating inventory: " + (err.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Modal Header */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "25px",
        borderBottom: "2px solid #ecf0f1",
        paddingBottom: "15px"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "2rem" }}>✏️</span>
          <h2 style={{ color: "#2c3e50", margin: 0, fontSize: "1.8rem" }}>Edit Inventory</h2>
        </div>
        <button
          onClick={onCancel}
          style={{
            background: "transparent",
            border: "none",
            fontSize: "2rem",
            cursor: "pointer",
            color: "#7f8c8d",
            lineHeight: "1",
            padding: "0",
            width: "30px",
            height: "30px"
          }}
          onMouseOver={(e) => e.target.style.color = "#e74c3c"}
          onMouseOut={(e) => e.target.style.color = "#7f8c8d"}
        >
          ×
        </button>
      </div>

      {/* Display Pub and Beer Info (Read-only) */}
      <div style={{ marginBottom: "25px", padding: "15px", background: "#f8f9fa", borderRadius: "10px" }}>
        <div style={{ marginBottom: "10px" }}>
          <span style={{ fontWeight: "bold", color: "#7f8c8d" }}>🏪 Pub: </span>
          <span style={{ color: "#2c3e50", fontSize: "1.1rem" }}>{inventory.pub_name}</span>
        </div>
        <div>
          <span style={{ fontWeight: "bold", color: "#7f8c8d" }}>🍺 Beer: </span>
          <span style={{ color: "#2c3e50", fontSize: "1.1rem" }}>{inventory.beer_name}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: "20px" }}>
        <div>
          <label style={{ display: "block", marginBottom: "8px", color: "#2c3e50", fontWeight: "bold", fontSize: "1rem" }}>
            📊 Quantity Available *
          </label>
          <input
            name="quantity_available"
            type="number"
            step="0.01"
            value={form.quantity_available}
            onChange={handleChange}
            style={{ 
              width: "100%", 
              padding: "12px", 
              border: "2px solid #ecf0f1", 
              borderRadius: "8px", 
              fontSize: "1rem"
            }}
            required
          />
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "8px", color: "#2c3e50", fontWeight: "bold", fontSize: "1rem" }}>
            ⚠️ Reorder Threshold
          </label>
          <input
            name="reorder_threshold"
            type="number"
            step="0.01"
            value={form.reorder_threshold}
            onChange={handleChange}
            style={{ 
              width: "100%", 
              padding: "12px", 
              border: "2px solid #ecf0f1", 
              borderRadius: "8px", 
              fontSize: "1rem"
            }}
          />
          <small style={{ color: "#7f8c8d", fontSize: "0.85rem" }}>
            Alert will trigger when quantity falls below this value
          </small>
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "8px", color: "#2c3e50", fontWeight: "bold", fontSize: "1rem" }}>
            📍 Storage Location
          </label>
          <input
            name="storage_location"
            type="text"
            value={form.storage_location}
            onChange={handleChange}
            style={{ 
              width: "100%", 
              padding: "12px", 
              border: "2px solid #ecf0f1", 
              borderRadius: "8px", 
              fontSize: "1rem"
            }}
            placeholder="e.g., Shelf A1, Cooler B2"
          />
        </div>

        <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
          <button
            type="submit"
            disabled={loading}
            style={{
              flex: 1,
              padding: "15px 30px",
              background: loading ? "#95a5a6" : "linear-gradient(45deg, #27ae60, #229954)",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "1.1rem",
              fontWeight: "bold",
              cursor: loading ? "not-allowed" : "pointer",
              boxShadow: loading ? "none" : "0 4px 15px rgba(39, 174, 96, 0.3)",
              transition: "all 0.2s"
            }}
            onMouseOver={(e) => {
              if (!loading) e.target.style.transform = "translateY(-2px)";
            }}
            onMouseOut={(e) => {
              if (!loading) e.target.style.transform = "translateY(0)";
            }}
          >
            {loading ? "🔄 Saving..." : "💾 Save Changes"}
          </button>
          
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            style={{
              flex: 1,
              padding: "15px 30px",
              background: "#95a5a6",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "1.1rem",
              fontWeight: "bold",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "all 0.2s"
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

function PubHasBeerForm() {
  const [form, setForm] = useState({ pub_id: "", beer_id: "", quantity_available: "", reorder_threshold: "", storage_location: "" });
  const [loading, setLoading] = useState(false);
  const handleChange = (e) => setForm((s) => ({ ...s, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        pub_id: Number(form.pub_id),
        beer_id: Number(form.beer_id),
        quantity_available: form.quantity_available === "" ? 0 : Number(form.quantity_available),
        reorder_threshold: form.reorder_threshold === "" ? null : Number(form.reorder_threshold),
        storage_location: form.storage_location || null,
      };
      await upsertPubHasBeerAdmin(payload);
      alert("✅ Inventory updated successfully!");
      setForm({ pub_id: "", beer_id: "", quantity_available: "", reorder_threshold: "", storage_location: "" });
    } catch (err) {
      console.error(err);
      alert("❌ Error updating inventory: " + (err.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "grid", gap: "15px", maxWidth: "500px", margin: "0 auto" }}>
      <div>
        <label style={{ display: "block", marginBottom: "5px", color: "#2c3e50", fontWeight: "bold" }}>🏪 Pub ID *</label>
        <input name="pub_id" type="number" placeholder="Enter pub ID" value={form.pub_id} onChange={handleChange} style={{ width: "100%", padding: "10px", border: "2px solid #ecf0f1", borderRadius: "8px", fontSize: "1rem" }} required />
      </div>
      <div>
        <label style={{ display: "block", marginBottom: "5px", color: "#2c3e50", fontWeight: "bold" }}>🍺 Beer ID *</label>
        <input name="beer_id" type="number" placeholder="Enter beer ID" value={form.beer_id} onChange={handleChange} style={{ width: "100%", padding: "10px", border: "2px solid #ecf0f1", borderRadius: "8px", fontSize: "1rem" }} required />
      </div>
      <div>
        <label style={{ display: "block", marginBottom: "5px", color: "#2c3e50", fontWeight: "bold" }}>📦 Quantity Available</label>
        <input name="quantity_available" type="number" min="0" placeholder="0" value={form.quantity_available} onChange={handleChange} style={{ width: "100%", padding: "10px", border: "2px solid #ecf0f1", borderRadius: "8px", fontSize: "1rem" }} />
      </div>
      <div>
        <label style={{ display: "block", marginBottom: "5px", color: "#2c3e50", fontWeight: "bold" }}>🔄 Reorder Threshold</label>
        <input name="reorder_threshold" type="number" min="0" placeholder="Minimum stock level" value={form.reorder_threshold} onChange={handleChange} style={{ width: "100%", padding: "10px", border: "2px solid #ecf0f1", borderRadius: "8px", fontSize: "1rem" }} />
      </div>
      <div>
        <label style={{ display: "block", marginBottom: "5px", color: "#2c3e50", fontWeight: "bold" }}>📍 Storage Location</label>
        <input name="storage_location" placeholder="e.g., Fridge A, Shelf 3" value={form.storage_location} onChange={handleChange} style={{ width: "100%", padding: "10px", border: "2px solid #ecf0f1", borderRadius: "8px", fontSize: "1rem" }} />
      </div>
      <button type="submit" disabled={loading} style={{ padding: "15px 30px", background: loading ? "#95a5a6" : "linear-gradient(45deg, #3498db, #2980b9)", color: "white", border: "none", borderRadius: "8px", fontSize: "1.1rem", fontWeight: "bold", cursor: loading ? "not-allowed" : "pointer" }}> {loading ? "🔄 Updating Inventory..." : "📦 Update Inventory"} </button>
    </form>
  );
}

function RestockPanel() {
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  const load = React.useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchPubsNeedsRestock();
      setRows(data || []);
    } catch (err) {
      console.error('Failed to fetch restock rows', err);
      alert('❌ Failed to fetch restock list');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleSetQuantity = useCallback((pub_id, beer_id) => {
    navigate(`/place-order?pub_id=${pub_id}&beer_id=${beer_id}`);
  }, [navigate]);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
        <button onClick={load} disabled={loading} style={{ padding: "10px 20px", background: loading ? "#95a5a6" : "linear-gradient(45deg, #3498db, #2980b9)", color: "white", border: "none", borderRadius: "8px" }}>{loading ? "🔄 Loading..." : "🔄 Refresh List"}</button>
      </div>

      {rows.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px", color: "#7f8c8d", background: "#f8f9fa", borderRadius: "10px" }}>
          <div style={{ fontSize: "3rem", marginBottom: "20px" }}>✅</div>
          <h3>All stocked up!</h3>
          <p>No items need restocking at this time.</p>
        </div>
      ) : (
        <div style={{ background: "white", borderRadius: "10px", overflow: "hidden", boxShadow: "0 4px 15px rgba(0,0,0,0.1)" }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: "0.9rem" }}>
            <thead>
              <tr style={{ background: "#2c3e50", color: "white" }}>
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: "bold", borderRight: "1px solid #34495e" }}>🏪 Pub</th>
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: "bold", borderRight: "1px solid #34495e" }}>🍺 Beer</th>
                <th style={{ padding: '12px', textAlign: 'right', fontWeight: "bold", borderRight: "1px solid #34495e" }}>📦 Current Qty</th>
                <th style={{ padding: '12px', textAlign: 'right', fontWeight: "bold", borderRight: "1px solid #34495e" }}>🎯 Reorder At</th>
                <th style={{ padding: '12px', textAlign: 'center', fontWeight: "bold" }}>⚡ Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, idx) => (
                <tr key={`${r.pub_id}-${r.beer_id}-${idx}`} style={{ background: idx % 2 === 0 ? "#f8f9fa" : "white" }}>
                  <td style={{ padding: '12px', borderRight: "1px solid #ecf0f1" }}>{r.pub_name || `Pub ${r.pub_id}`}</td>
                  <td style={{ padding: '12px', borderRight: "1px solid #ecf0f1" }}>{r.beer_name || `Beer ${r.beer_id}`}</td>
                  <td style={{ padding: '12px', textAlign: 'right', borderRight: "1px solid #ecf0f1", fontWeight: "bold", color: r.quantity_available <= (r.reorder_threshold || 0) ? "#e74c3c" : "#27ae60" }}>{r.quantity_available ?? '—'}</td>
                  <td style={{ padding: '12px', textAlign: 'right', borderRight: "1px solid #ecf0f1" }}>{r.reorder_threshold ?? '—'}</td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>
                    <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
                      <button onClick={() => handleSetQuantity(r.pub_id, r.beer_id)} style={{ padding: "6px 12px", background: "#27ae60", color: "white", border: "none", borderRadius: "5px" }}>Order Now</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function AddPubForm({ onSuccess }) {
  const [form, setForm] = useState({
    name: "",
    manager_name: "",
    phone: "",
    street: "",
    city: "",
    postal_code: "",
    country: ""
  });
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleChange = (e) => setForm((s) => ({ ...s, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage(null);
    try {
      const result = await createPub(form);
      setSuccessMessage(`✅ Pub "${result.name}" created successfully with ID #${result.pub_id}!`);
      setForm({
        name: "",
        manager_name: "",
        phone: "",
        street: "",
        city: "",
        postal_code: "",
        country: ""
      });
      setTimeout(() => {
        if (onSuccess) onSuccess();
      }, 2000);
    } catch (err) {
      console.error(err);
      alert("❌ Error creating pub: " + (err.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {successMessage && (
        <div style={{
          background: "linear-gradient(135deg, #27ae60, #229954)",
          color: "white",
          padding: "15px 20px",
          borderRadius: "10px",
          marginBottom: "20px",
          textAlign: "center",
          fontSize: "1.1rem",
          fontWeight: "bold",
          boxShadow: "0 4px 15px rgba(39, 174, 96, 0.3)"
        }}>
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: "15px", maxWidth: "600px", margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
          <div style={{ gridColumn: "1 / -1" }}>
            <label style={{ display: "block", marginBottom: "5px", color: "#2c3e50", fontWeight: "bold" }}>🏪 Pub Name *</label>
            <input
              name="name"
              type="text"
              placeholder="e.g., The Crown & Anchor"
              value={form.name}
              onChange={handleChange}
              style={{ width: "100%", padding: "12px", border: "2px solid #ecf0f1", borderRadius: "8px", fontSize: "1rem" }}
              required
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "5px", color: "#2c3e50", fontWeight: "bold" }}>👤 Manager Name</label>
            <input
              name="manager_name"
              type="text"
              placeholder="Manager's full name"
              value={form.manager_name}
              onChange={handleChange}
              style={{ width: "100%", padding: "12px", border: "2px solid #ecf0f1", borderRadius: "8px", fontSize: "1rem" }}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "5px", color: "#2c3e50", fontWeight: "bold" }}>📞 Phone</label>
            <input
              name="phone"
              type="tel"
              placeholder="+1-234-567-8900"
              value={form.phone}
              onChange={handleChange}
              maxLength="15"
              style={{ width: "100%", padding: "12px", border: "2px solid #ecf0f1", borderRadius: "8px", fontSize: "1rem" }}
            />
          </div>

          <div style={{ gridColumn: "1 / -1" }}>
            <label style={{ display: "block", marginBottom: "5px", color: "#2c3e50", fontWeight: "bold" }}>📍 Street Address</label>
            <input
              name="street"
              type="text"
              placeholder="123 Main Street"
              value={form.street}
              onChange={handleChange}
              style={{ width: "100%", padding: "12px", border: "2px solid #ecf0f1", borderRadius: "8px", fontSize: "1rem" }}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "5px", color: "#2c3e50", fontWeight: "bold" }}>🏙️ City</label>
            <input
              name="city"
              type="text"
              placeholder="London"
              value={form.city}
              onChange={handleChange}
              style={{ width: "100%", padding: "12px", border: "2px solid #ecf0f1", borderRadius: "8px", fontSize: "1rem" }}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "5px", color: "#2c3e50", fontWeight: "bold" }}>📮 Postal Code</label>
            <input
              name="postal_code"
              type="text"
              placeholder="SW1A 1AA"
              value={form.postal_code}
              onChange={handleChange}
              maxLength="12"
              style={{ width: "100%", padding: "12px", border: "2px solid #ecf0f1", borderRadius: "8px", fontSize: "1rem" }}
            />
          </div>

          <div style={{ gridColumn: "1 / -1" }}>
            <label style={{ display: "block", marginBottom: "5px", color: "#2c3e50", fontWeight: "bold" }}>🌍 Country</label>
            <input
              name="country"
              type="text"
              placeholder="United Kingdom"
              value={form.country}
              onChange={handleChange}
              style={{ width: "100%", padding: "12px", border: "2px solid #ecf0f1", borderRadius: "8px", fontSize: "1rem" }}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "15px 30px",
            background: loading ? "#95a5a6" : "linear-gradient(45deg, #e91e63, #c2185b)",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontSize: "1.1rem",
            fontWeight: "bold",
            cursor: loading ? "not-allowed" : "pointer",
            boxShadow: loading ? "none" : "0 4px 15px rgba(233, 30, 99, 0.3)",
            transition: "all 0.2s",
            marginTop: "10px"
          }}
          onMouseOver={(e) => {
            if (!loading) e.target.style.transform = "translateY(-2px)";
          }}
          onMouseOut={(e) => {
            if (!loading) e.target.style.transform = "translateY(0)";
          }}
        >
          {loading ? "🔄 Creating Pub..." : "🏪 Create Pub"}
        </button>
      </form>

      <div style={{
        marginTop: "30px",
        padding: "20px",
        background: "#f8f9fa",
        borderRadius: "10px",
        fontSize: "0.9rem",
        color: "#7f8c8d"
      }}>
        <h4 style={{ color: "#2c3e50", marginBottom: "10px" }}>💡 Tips:</h4>
        <ul style={{ marginLeft: "20px", lineHeight: "1.8" }}>
          <li>Only the pub name is required - all other fields are optional</li>
          <li>After creating a pub, you can add inventory via the "Update Inventory" section</li>
          <li>Phone numbers are limited to 15 characters</li>
          <li>Postal codes are limited to 12 characters</li>
        </ul>
      </div>
    </div>
  );
}
