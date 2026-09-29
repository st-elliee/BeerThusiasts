const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5001";
const BASE_URL = `${API_BASE}/api/beers`;

export const fetchBeers = async (filters = {}) => {
  const params = new URLSearchParams(filters);
  const res = await fetch(`${BASE_URL}?${params}`);
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json();
};

export const fetchBrands = async () => {
  const res = await fetch(`${API_BASE}/api/brands`);
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json();
};

export const fetchPubs = async () => {
  const res = await fetch(`${API_BASE}/api/pubs`);
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json();
};

export const createPub = async (pubData) => {
  const res = await fetch(`${API_BASE}/api/pubs`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(pubData),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || `API error ${res.status}`);
  }
  return res.json();
};

export const updatePub = async (pubId, pubData) => {
  const res = await fetch(`${API_BASE}/api/pubs/${pubId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(pubData),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || `API error ${res.status}`);
  }
  return res.json();
};

export const fetchPubsNeedsRestock = async () => {
  const res = await fetch(`${API_BASE}/api/pubs/needs-restock`);
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json();
};

export const fetchBeer = async (id) => {
  const res = await fetch(`${API_BASE}/api/beers/${encodeURIComponent(id)}`);
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json();
};

export const fetchReviews = async (beerId) => {
  const res = await fetch(`${API_BASE}/api/reviews/${encodeURIComponent(beerId)}`);
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json();
};

export const postReview = async (beerId, review) => {
  const res = await fetch(`${API_BASE}/api/reviews/${encodeURIComponent(beerId)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(review),
  });
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json();
};

export const postOrder = async (order) => {
  const res = await fetch(`${API_BASE}/api/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(order),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `API error ${res.status}`);
  }
  return res.json();
};

export const fetchOrders = async (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.pub_id) params.append('pub_id', filters.pub_id);
  if (filters.status) params.append('status', filters.status);
  const url = `${API_BASE}/api/orders${params.toString() ? '?' + params.toString() : ''}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json();
};

export const patchOrderStatus = async (orderId, status, pub_id) => {
  const res = await fetch(`${API_BASE}/api/orders/${encodeURIComponent(orderId)}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status, pub_id }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `API error ${res.status}`);
  }
  return res.json();
};

export const fetchOrderDetails = async (orderId, pubId = null) => {
  let url = `${API_BASE}/api/orders/${encodeURIComponent(orderId)}/details`;
  if (pubId) {
    url += `?pub_id=${encodeURIComponent(pubId)}`;
  }
  const res = await fetch(url);
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json();
};

// Admin API helpers
export const createBeerAdmin = async (beer) => {
  const res = await fetch(`${API_BASE}/api/admin/beers`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(beer),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `API error ${res.status}`);
  }
  return res.json();
};

export const updateBeerAdmin = async (id, fields) => {
  const res = await fetch(`${API_BASE}/api/admin/beers/${encodeURIComponent(id)}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(fields),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `API error ${res.status}`);
  }
  return res.json();
};

export const deleteBeerAdmin = async (id) => {
  const res = await fetch(`${API_BASE}/api/admin/beers/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `API error ${res.status}`);
  }
  return res.json();
};

export const fetchInventory = async () => {
  const res = await fetch(`${API_BASE}/api/admin/inventory`);
  if (!res.ok) throw new Error("Failed to fetch inventory");
  return res.json();
};

export const updateInventory = async (pubId, beerId, data) => {
  const res = await fetch(`${API_BASE}/api/admin/inventory/${pubId}/${beerId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const errData = await res.json().catch(() => ({ error: "Unknown error" }));
    throw new Error(errData.error || "Failed to update inventory");
  }
  return res.json();
};

export const upsertPubHasBeerAdmin = async (row) => {
  const res = await fetch(`${API_BASE}/api/admin/pubhasbeer`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(row),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `API error ${res.status}`);
  }
  return res.json();
};

export const fetchEnum = async (table, column) => {
  const url = `${API_BASE}/api/admin/enums?table=${encodeURIComponent(table)}&column=${encodeURIComponent(column)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json();
};

export const fetchEnums = async () => {
  const res = await fetch(`${API_BASE}/api/admin/enums`);
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json();
};

// Employee API helpers
export const fetchEmployees = async (pubId = null) => {
  const url = pubId
    ? `${API_BASE}/api/admin/employees?pub_id=${encodeURIComponent(pubId)}`
    : `${API_BASE}/api/admin/employees`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json();
};

export const createEmployeeAdmin = async (employee) => {
  const res = await fetch(`${API_BASE}/api/admin/employees`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(employee),
  });
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json();
};

export const updateEmployeeAdmin = async (id, employee) => {
  const res = await fetch(`${API_BASE}/api/admin/employees/${encodeURIComponent(id)}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(employee),
  });
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json();
};

export const deleteEmployeeAdmin = async (id) => {
  const res = await fetch(`${API_BASE}/api/admin/employees/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json();
};

// Supplier ordering functions
export const fetchSuppliersForBrand = async (brandId) => {
  const res = await fetch(`${API_BASE}/api/admin/suppliers/brand/${encodeURIComponent(brandId)}`);
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json();
};

export const placeSupplierOrder = async (orderData) => {
  const res = await fetch(`${API_BASE}/api/admin/supplier-orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(orderData),
  });
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json();
};

export const fetchSupplierOrders = async () => {
  const res = await fetch(`${API_BASE}/api/admin/supplier-orders`);
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json();
};

export const updateSupplierOrder = async (orderId, updates) => {
  const res = await fetch(`${API_BASE}/api/admin/supplier-orders/${orderId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json();
};

export { API_BASE };
