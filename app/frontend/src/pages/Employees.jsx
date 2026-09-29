import { useEffect, useState } from "react";
import { fetchEmployees, createEmployeeAdmin, updateEmployeeAdmin, deleteEmployeeAdmin, fetchPubs } from "../api/beer";

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [pubs, setPubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [selectedPubId, setSelectedPubId] = useState(null);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    position: "",
    shift: "",
    hire_date: "",
    salary: "",
    pub_id: ""
  });

  const loadData = async (pubId = null) => {
    setLoading(true);
    try {
      // First load pubs to ensure we have the pub data for filtering
      const pubData = await fetchPubs();
      setPubs(pubData);
      
      // Then load employees (filtered if pubId is provided)
      const empData = await fetchEmployees(pubId);
      setEmployees(empData);
    } catch (err) {
      console.error("Failed to load data:", err);
      alert("❌ Failed to load data: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Load pubs first on initial mount
    const loadInitialData = async () => {
      setLoading(true);
      try {
        const pubData = await fetchPubs();
        setPubs(pubData);
        // Then load employees (no filter initially)
        const empData = await fetchEmployees(null);
        setEmployees(empData);
      } catch (err) {
        console.error("Failed to load initial data:", err);
        alert("❌ Failed to load data: " + err.message);
      } finally {
        setLoading(false);
      }
    };
    
    loadInitialData();
  }, []); // Only run on mount

  useEffect(() => {
    // Reload employees when pub filter changes (but not on initial mount)
    if (selectedPubId !== null) {
      const loadFilteredEmployees = async () => {
        try {
          const empData = await fetchEmployees(selectedPubId);
          setEmployees(empData);
        } catch (err) {
          console.error("Failed to load filtered employees:", err);
          alert("❌ Failed to load employees: " + err.message);
        }
      };
      
      loadFilteredEmployees();
    }
  }, [selectedPubId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingEmployee) {
        await updateEmployeeAdmin(editingEmployee.employee_id, formData);
        alert("✅ Employee updated successfully!");
      } else {
        await createEmployeeAdmin(formData);
        alert("✅ Employee created successfully!");
      }
      setShowForm(false);
      setEditingEmployee(null);
      resetForm();
      loadData();
    } catch (err) {
      console.error("Failed to save employee:", err);
      alert("❌ Failed to save employee: " + err.message);
    }
  };

  const handleEdit = (employee) => {
    setEditingEmployee(employee);
    setFormData({
      first_name: employee.first_name,
      last_name: employee.last_name,
      email: employee.email || "",
      phone: employee.phone || "",
      position: employee.position || "",
      shift: employee.shift || "",
      hire_date: employee.hire_date ? employee.hire_date.split('T')[0] : "",
      salary: employee.salary || "",
      pub_id: employee.pub_id || ""
    });
    setShowForm(true);
  };

  const handleDelete = async (employeeId, employeeName) => {
    if (!window.confirm(`Are you sure you want to delete ${employeeName}?`)) return;

    try {
      await deleteEmployeeAdmin(employeeId);
      alert("✅ Employee deleted successfully!");
      loadData();
    } catch (err) {
      console.error("Failed to delete employee:", err);
      alert("❌ Failed to delete employee: " + err.message);
    }
  };

  const resetForm = () => {
    setFormData({
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      position: "",
      shift: "",
      hire_date: "",
      salary: "",
      pub_id: selectedPubId || ""
    });
  };

  const totalSalary = employees.reduce((sum, emp) => sum + (Number(emp.salary) || 0), 0);
  const selectedPub = pubs.find(pub => Number(pub.pub_id) === Number(selectedPubId));
  const selectedPubName = selectedPub?.name || selectedPubId;

  if (loading) return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "50vh",
      fontSize: "1.2rem",
      color: "#7f8c8d"
    }}>
      👥 Loading employees...
    </div>
  );

  return (
    <div style={{
      maxWidth: "1400px",
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
        {/* Header */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "30px",
          borderBottom: "3px solid #ecf0f1",
          paddingBottom: "20px"
        }}>
          <div>
            <h1 style={{
              color: "#2c3e50",
              margin: "0 0 10px 0",
              fontSize: "2.5rem",
              textShadow: "1px 1px 2px rgba(0,0,0,0.1)"
            }}>
              👥 Company Records
            </h1>
            <p style={{
              color: "#7f8c8d",
              margin: 0,
              fontSize: "1.1rem"
            }}>
              {selectedPubId
                ? `Viewing employees for ${selectedPubName} • Manage employee information and company directory`
                : 'Manage employee information and company directory'
              }
            </p>
          </div>

          <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
            {/* Pub Filter */}
            <div>
              <label style={{
                display: "block",
                marginBottom: "5px",
                fontWeight: "bold",
                color: "#2c3e50",
                fontSize: "0.9rem"
              }}>
                🏪 Filter by Pub:
              </label>
              <select
                value={selectedPubId || ""}
                onChange={(e) => setSelectedPubId(e.target.value === "" ? null : parseInt(e.target.value))}
                style={{
                  padding: "8px 12px",
                  border: "2px solid #ecf0f1",
                  borderRadius: "5px",
                  fontSize: "0.9rem",
                  background: "white",
                  minWidth: "200px"
                }}
              >
                <option value="">All Pubs</option>
                {pubs.map(pub => (
                  <option key={pub.pub_id} value={pub.pub_id}>
                    {pub.name} (ID: {pub.pub_id})
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => {
                setEditingEmployee(null);
                resetForm();
                setShowForm(true);
              }}
              style={{
                padding: "12px 20px",
                background: "linear-gradient(45deg, #27ae60, #229954)",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontSize: "1rem",
                fontWeight: "bold",
                cursor: "pointer",
                boxShadow: "0 4px 15px rgba(39, 174, 96, 0.3)",
                transition: "transform 0.2s"
              }}
              onMouseOver={(e) => e.target.style.transform = "translateY(-2px)"}
              onMouseOut={(e) => e.target.style.transform = "translateY(0)"}
            >
              ➕ Add Employee
            </button>
          </div>
        </div>

        {/* Summary Stats */}
        <div style={{
          display: "flex",
          gap: "20px",
          marginBottom: "30px",
          flexWrap: "wrap"
        }}>
          <div style={{
            background: "linear-gradient(45deg, #3498db, #2980b9)",
            color: "white",
            padding: "20px",
            borderRadius: "10px",
            flex: "1",
            minWidth: "200px",
            textAlign: "center",
            boxShadow: "0 4px 15px rgba(52, 152, 219, 0.3)"
          }}>
            <div style={{ fontSize: "2rem", marginBottom: "5px" }}>👥</div>
            <div style={{ fontSize: "1.5rem", fontWeight: "bold" }}>{employees.length}</div>
            <div style={{ fontSize: "0.9rem", opacity: 0.9 }}>
              {selectedPubId ? `Employees at ${selectedPubName}` : 'Total Employees'}
            </div>
          </div>

          <div style={{
            background: "linear-gradient(45deg, #e74c3c, #c0392b)",
            color: "white",
            padding: "20px",
            borderRadius: "10px",
            flex: "1",
            minWidth: "200px",
            textAlign: "center",
            boxShadow: "0 4px 15px rgba(231, 76, 60, 0.3)"
          }}>
            <div style={{ fontSize: "2rem", marginBottom: "5px" }}>💰</div>
            <div style={{ fontSize: "1.5rem", fontWeight: "bold" }}>${totalSalary.toLocaleString()}</div>
            <div style={{ fontSize: "0.9rem", opacity: 0.9 }}>
              {selectedPubId ? `Budget for ${selectedPubName}` : 'Total Salary Budget'}
            </div>
          </div>

          {selectedPubId && (
            <div style={{
              background: "linear-gradient(45deg, #9b59b6, #8e44ad)",
              color: "white",
              padding: "20px",
              borderRadius: "10px",
              flex: "1",
              minWidth: "200px",
              textAlign: "center",
              boxShadow: "0 4px 15px rgba(155, 89, 182, 0.3)"
            }}>
              <div style={{ fontSize: "2rem", marginBottom: "5px" }}>🏪</div>
              <div style={{ fontSize: "1.2rem", fontWeight: "bold" }}>
                {selectedPubName}
              </div>
              <div style={{ fontSize: "0.9rem", opacity: 0.9 }}>
                Pub ID: {selectedPubId}
              </div>
            </div>
          )}
        </div>

        {/* Employee Form Modal */}
        {showForm && (
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
            zIndex: 1000
          }}>
            <div style={{
              background: "white",
              borderRadius: "15px",
              padding: "30px",
              maxWidth: "600px",
              width: "90%",
              maxHeight: "80vh",
              overflow: "auto"
            }}>
              <h2 style={{
                margin: "0 0 20px 0",
                color: "#2c3e50",
                textAlign: "center"
              }}>
                {editingEmployee ? "✏️ Edit Employee" : "➕ Add New Employee"}
              </h2>

              <form onSubmit={handleSubmit} style={{
                display: "flex",
                flexDirection: "column",
                gap: "15px"
              }}>
                <div style={{ display: "flex", gap: "10px" }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", color: "#2c3e50" }}>
                      First Name *
                    </label>
                    <input
                      type="text"
                      value={formData.first_name}
                      onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                      style={{
                        width: "100%",
                        padding: "10px",
                        border: "2px solid #ecf0f1",
                        borderRadius: "5px",
                        fontSize: "1rem",
                        boxSizing: "border-box"
                      }}
                      required
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", color: "#2c3e50" }}>
                      Last Name *
                    </label>
                    <input
                      type="text"
                      value={formData.last_name}
                      onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                      style={{
                        width: "100%",
                        padding: "10px",
                        border: "2px solid #ecf0f1",
                        borderRadius: "5px",
                        fontSize: "1rem",
                        boxSizing: "border-box"
                      }}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", color: "#2c3e50" }}>
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    style={{
                      width: "100%",
                      padding: "10px",
                      border: "2px solid #ecf0f1",
                      borderRadius: "5px",
                      fontSize: "1rem",
                      boxSizing: "border-box"
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", color: "#2c3e50" }}>
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    style={{
                      width: "100%",
                      padding: "10px",
                      border: "2px solid #ecf0f1",
                      borderRadius: "5px",
                      fontSize: "1rem",
                      boxSizing: "border-box"
                    }}
                  />
                </div>

                <div style={{ display: "flex", gap: "10px" }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", color: "#2c3e50" }}>
                      Position
                    </label>
                    <input
                      type="text"
                      value={formData.position}
                      onChange={(e) => setFormData({...formData, position: e.target.value})}
                      style={{
                        width: "100%",
                        padding: "10px",
                        border: "2px solid #ecf0f1",
                        borderRadius: "5px",
                        fontSize: "1rem",
                        boxSizing: "border-box"
                      }}
                      placeholder="e.g., Manager, Bartender"
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", color: "#2c3e50" }}>
                      Shift
                    </label>
                    <input
                      type="text"
                      value={formData.shift}
                      onChange={(e) => setFormData({...formData, shift: e.target.value})}
                      style={{
                        width: "100%",
                        padding: "10px",
                        border: "2px solid #ecf0f1",
                        borderRadius: "5px",
                        fontSize: "1rem",
                        boxSizing: "border-box"
                      }}
                      placeholder="e.g., Morning, Evening"
                    />
                  </div>
                </div>

                <div style={{ display: "flex", gap: "10px" }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", color: "#2c3e50" }}>
                      Hire Date
                    </label>
                    <input
                      type="date"
                      value={formData.hire_date}
                      onChange={(e) => setFormData({...formData, hire_date: e.target.value})}
                      style={{
                        width: "100%",
                        padding: "10px",
                        border: "2px solid #ecf0f1",
                        borderRadius: "5px",
                        fontSize: "1rem",
                        boxSizing: "border-box"
                      }}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", color: "#2c3e50" }}>
                      Salary ($)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.salary}
                      onChange={(e) => setFormData({...formData, salary: e.target.value})}
                      style={{
                        width: "100%",
                        padding: "10px",
                        border: "2px solid #ecf0f1",
                        borderRadius: "5px",
                        fontSize: "1rem",
                        boxSizing: "border-box"
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", color: "#2c3e50" }}>
                    Assigned Pub
                  </label>
                  <select
                    value={formData.pub_id}
                    onChange={(e) => setFormData({...formData, pub_id: e.target.value})}
                    style={{
                      width: "100%",
                      padding: "10px",
                      border: "2px solid #ecf0f1",
                      borderRadius: "5px",
                      fontSize: "1rem",
                      background: "white",
                      boxSizing: "border-box"
                    }}
                  >
                    <option value="">— None —</option>
                    {pubs.map((pub) => (
                      <option key={pub.pub_id} value={pub.pub_id}>
                        {pub.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div style={{
                  display: "flex",
                  gap: "10px",
                  marginTop: "20px"
                }}>
                  <button
                    type="submit"
                    style={{
                      flex: 1,
                      padding: "12px",
                      background: "linear-gradient(45deg, #27ae60, #229954)",
                      color: "white",
                      border: "none",
                      borderRadius: "5px",
                      fontSize: "1rem",
                      fontWeight: "bold",
                      cursor: "pointer"
                    }}
                  >
                    {editingEmployee ? "💾 Update Employee" : "➕ Create Employee"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setEditingEmployee(null);
                      resetForm();
                    }}
                    style={{
                      flex: 1,
                      padding: "12px",
                      background: "#95a5a6",
                      color: "white",
                      border: "none",
                      borderRadius: "5px",
                      fontSize: "1rem",
                      fontWeight: "bold",
                      cursor: "pointer"
                    }}
                  >
                    ❌ Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Employees Table */}
        <div style={{
          background: "white",
          borderRadius: "10px",
          overflow: "hidden",
          boxShadow: "0 4px 15px rgba(0,0,0,0.1)"
        }}>
          <table style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: "0.9rem"
          }}>
            <thead>
              <tr style={{ background: "#2c3e50", color: "white" }}>
                <th style={{ padding: "15px 12px", textAlign: "left", fontWeight: "bold" }}>👤 Employee</th>
                <th style={{ padding: "15px 12px", textAlign: "left", fontWeight: "bold" }}>📧 Contact</th>
                <th style={{ padding: "15px 12px", textAlign: "left", fontWeight: "bold" }}>💼 Position</th>
                <th style={{ padding: "15px 12px", textAlign: "left", fontWeight: "bold" }}>⏰ Shift</th>
                <th style={{ padding: "15px 12px", textAlign: "left", fontWeight: "bold" }}>🏪 Pub</th>
                <th style={{ padding: "15px 12px", textAlign: "right", fontWeight: "bold" }}>💰 Salary</th>
                <th style={{ padding: "15px 12px", textAlign: "center", fontWeight: "bold" }}>⚙️ Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp, idx) => (
                <tr key={emp.employee_id} style={{
                  background: idx % 2 === 0 ? "#f8f9fa" : "white",
                  transition: "background 0.2s"
                }}
                onMouseOver={(e) => e.target.closest('tr').style.background = "#ecf0f1"}
                onMouseOut={(e) => e.target.closest('tr').style.background = idx % 2 === 0 ? "#f8f9fa" : "white"}
                >
                  <td style={{ padding: "12px" }}>
                    <div>
                      <div style={{ fontWeight: "bold", color: "#2c3e50" }}>
                        {emp.first_name} {emp.last_name}
                      </div>
                      <div style={{ fontSize: "0.8rem", color: "#7f8c8d" }}>
                        ID: {emp.employee_id}
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "12px" }}>
                    <div>
                      {emp.email && (
                        <div style={{ fontSize: "0.9rem", color: "#3498db" }}>
                          📧 {emp.email}
                        </div>
                      )}
                      {emp.phone && (
                        <div style={{ fontSize: "0.9rem", color: "#27ae60" }}>
                          📞 {emp.phone}
                        </div>
                      )}
                    </div>
                  </td>
                  <td style={{ padding: "12px", fontWeight: "bold", color: "#2c3e50" }}>
                    {emp.position || "N/A"}
                  </td>
                  <td style={{ padding: "12px", fontWeight: "bold", color: "#e74c3c" }}>
                    {emp.shift || "N/A"}
                  </td>
                  <td style={{ padding: "12px" }}>
                    <div style={{ fontWeight: "bold", color: emp.pub_name ? "#27ae60" : "#7f8c8d" }}>
                      {emp.pub_name || "N/A"}
                    </div>
                  </td>
                  <td style={{ padding: "12px", textAlign: "right", fontWeight: "bold", color: "#e74c3c" }}>
                    ${Number(emp.salary || 0).toLocaleString()}
                  </td>
                  <td style={{ padding: "12px", textAlign: "center" }}>
                    <div style={{ display: "flex", gap: "6px", justifyContent: "center" }}>
                      <button
                        onClick={() => handleEdit(emp)}
                        style={{
                          padding: "6px 10px",
                          background: "#3498db",
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                          fontSize: "0.8rem",
                          fontWeight: "bold"
                        }}
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleDelete(emp.employee_id, `${emp.first_name} ${emp.last_name}`)}
                        style={{
                          padding: "6px 10px",
                          background: "#e74c3c",
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                          fontSize: "0.8rem",
                          fontWeight: "bold"
                        }}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {employees.length === 0 && (
          <div style={{
            textAlign: "center",
            padding: "60px 20px",
            color: "#7f8c8d"
          }}>
            <div style={{ fontSize: "4rem", marginBottom: "20px" }}>👥</div>
            <h3>No employees found</h3>
            <p>Add your first employee to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
}