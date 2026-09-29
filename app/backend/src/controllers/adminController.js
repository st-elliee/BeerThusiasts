import { pool } from "../db.js";

// Create a new beer
export const createBeer = async (req, res) => {
  const {
    name,
    beer_kind,
    alcohol_content,
    price,
    container_kind,
    volume_liters,
    brand_id,
  } = req.body;

  if (!name || typeof price === "undefined") {
    return res.status(400).json({ error: "name and price are required" });
  }

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    try {
      // Validate container_kind against ENUM definition if present to avoid truncation warnings
      if (container_kind) {
        try {
          const [[colInfo]] = await conn.query(
            `SELECT COLUMN_TYPE FROM information_schema.columns WHERE table_schema = DATABASE() AND table_name = 'beer' AND column_name = 'container_kind' LIMIT 1`
          );
          if (colInfo && colInfo.COLUMN_TYPE && colInfo.COLUMN_TYPE.startsWith("enum(")) {
            // parse enum values: enum('A','B') -> ['A','B']
            const vals = colInfo.COLUMN_TYPE
              .substring(5, colInfo.COLUMN_TYPE.length - 1)
              .split(/','/)
              .map((v) => v.replace(/^'/, "").replace(/'$/, ""));
            const provided = String(container_kind);
            if (!vals.includes(provided)) {
              await conn.rollback();
              return res.status(400).json({ error: "Invalid container_kind", allowed: vals });
            }
          }
        } catch (e) {
          // If schema inspection fails, continue and let DB handle it
          console.warn('Could not inspect container_kind column type', e);
        }
      }
      const [result] = await conn.query(
        `INSERT INTO beer (name, beer_kind, alcohol_content, price, container_kind, volume_liters, brand_id) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [name, beer_kind || null, alcohol_content || null, price, container_kind || null, volume_liters || null, brand_id || null]
      );
      const beerId = result.insertId;
      await conn.commit();
      return res.status(201).json({ beer_id: beerId });
    } catch (err) {
      // Handle schema without AUTO_INCREMENT on beer_id by computing next id
      if (err && err.code === "ER_NO_DEFAULT_FOR_FIELD") {
        const [[{ nextId }]] = await conn.query(`SELECT COALESCE(MAX(beer_id), 0) + 1 AS nextId FROM beer FOR UPDATE`);
        const beerId = nextId;
        await conn.query(
          `INSERT INTO beer (beer_id, name, beer_kind, alcohol_content, price, container_kind, volume_liters, brand_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [beerId, name, beer_kind || null, alcohol_content || null, price, container_kind || null, volume_liters || null, brand_id || null]
        );
        await conn.commit();
        return res.status(201).json({ beer_id: beerId });
      }
      throw err;
    }
  } catch (err) {
    console.error("createBeer error", err);
    try {
      await conn.rollback();
    } catch (e) {
      console.error("rollback error", e);
    }
    res.status(500).json({ error: "Database error" });
  } finally {
    conn.release();
  }
};

// Update existing beer
export const updateBeer = async (req, res) => {
  const id = req.params.id;
  const fields = req.body;
  if (!id) return res.status(400).json({ error: "beer id required" });
  if (!fields || Object.keys(fields).length === 0) return res.status(400).json({ error: "no fields to update" });

  const allowed = [
    "name",
    "beer_kind",
    "alcohol_content",
    "price",
    "container_kind",
    "volume_liters",
    "brand_id",
  ];
  const sets = [];
  const params = [];
  for (const k of allowed) {
    if (Object.prototype.hasOwnProperty.call(fields, k)) {
      sets.push(`${k} = ?`);
      params.push(fields[k]);
    }
  }
  if (sets.length === 0) return res.status(400).json({ error: "no updatable fields provided" });
  params.push(id);

  try {
    const sql = `UPDATE beer SET ${sets.join(", ")} WHERE beer_id = ?`;
    const [result] = await pool.query(sql, params);
    if (result.affectedRows === 0) return res.status(404).json({ error: "Beer not found" });
    res.json({ beer_id: Number(id) });
  } catch (err) {
    console.error("updateBeer error", err);
    res.status(500).json({ error: "Database error" });
  }
};

// Get all inventory entries (pubhasbeer)
export const getAllInventory = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        phb.pub_id,
        phb.beer_id,
        phb.quantity_available,
        phb.reorder_threshold,
        phb.storage_location,
        phb.last_updated,
        phb.remaining_until_reorder,
        p.name AS pub_name,
        b.name AS beer_name
      FROM pubhasbeer phb
      JOIN pub p ON phb.pub_id = p.pub_id
      JOIN beer b ON phb.beer_id = b.beer_id
      ORDER BY p.name, b.name
    `);
    res.json(rows);
  } catch (err) {
    console.error("getAllInventory error", err);
    res.status(500).json({ error: "Database error" });
  }
};

// Update pubhasbeer entry
export const updateInventory = async (req, res) => {
  const { pub_id, beer_id } = req.params;
  const { quantity_available, reorder_threshold, storage_location } = req.body;
  
  if (!pub_id || !beer_id) {
    return res.status(400).json({ error: "pub_id and beer_id required" });
  }

  try {
    const [result] = await pool.query(
      `UPDATE pubhasbeer 
       SET quantity_available = ?, 
           reorder_threshold = ?, 
           storage_location = ?,
           last_updated = NOW()
       WHERE pub_id = ? AND beer_id = ?`,
      [quantity_available || 0, reorder_threshold || null, storage_location || null, pub_id, beer_id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Inventory entry not found" });
    }

    // Return updated entry with names
    const [[updated]] = await pool.query(`
      SELECT 
        phb.pub_id,
        phb.beer_id,
        phb.quantity_available,
        phb.reorder_threshold,
        phb.storage_location,
        phb.last_updated,
        phb.remaining_until_reorder,
        p.name AS pub_name,
        b.name AS beer_name
      FROM pubhasbeer phb
      JOIN pub p ON phb.pub_id = p.pub_id
      JOIN beer b ON phb.beer_id = b.beer_id
      WHERE phb.pub_id = ? AND phb.beer_id = ?
    `, [pub_id, beer_id]);

    res.json(updated);
  } catch (err) {
    console.error("updateInventory error", err);
    res.status(500).json({ error: "Database error" });
  }
};

// Upsert pubhasbeer row (create or update inventory for a beer at a pub)
export const upsertPubHasBeer = async (req, res) => {
  const { pub_id, beer_id, quantity_available, reorder_threshold, storage_location, remaining_until_reorder } = req.body;
  if (!pub_id || !beer_id) return res.status(400).json({ error: "pub_id and beer_id required" });

  try {
    // Build INSERT ... ON DUPLICATE KEY UPDATE dynamically to avoid writing generated columns
    const hasRemaining = Object.prototype.hasOwnProperty.call(req.body, 'remaining_until_reorder');
    const insertCols = ['pub_id', 'beer_id', 'quantity_available', 'reorder_threshold', 'storage_location'];
    const insertPlaceholders = ['?', '?', '?', '?', '?'];
    const insertParams = [pub_id, beer_id, quantity_available || 0, reorder_threshold || null, storage_location || null];
    const updateAssignments = ['quantity_available = VALUES(quantity_available)', 'reorder_threshold = VALUES(reorder_threshold)', 'storage_location = VALUES(storage_location)'];

    if (hasRemaining) {
      insertCols.push('remaining_until_reorder');
      insertPlaceholders.push('?');
      insertParams.push(remaining_until_reorder);
      updateAssignments.push('remaining_until_reorder = VALUES(remaining_until_reorder)');
    }

    insertCols.push('last_updated');
    insertPlaceholders.push('NOW()');

    const sql = `INSERT INTO pubhasbeer (${insertCols.join(', ')}) VALUES (${insertPlaceholders.join(', ')}) ON DUPLICATE KEY UPDATE ${updateAssignments.join(', ')}, last_updated = NOW()`;
    const [result] = await pool.query(sql, insertParams);
    return res.json({ pub_id, beer_id });
  } catch (err) {
    // Fallback: try update then insert if update affected 0 rows
    try {
      // build update params excluding generated columns when necessary
      const hasRemaining = Object.prototype.hasOwnProperty.call(req.body, 'remaining_until_reorder');
      const updateParts = ['quantity_available = ?', 'reorder_threshold = ?', 'storage_location = ?', 'last_updated = NOW()'];
      const updateParams = [quantity_available || 0, reorder_threshold || null, storage_location || null];
      if (hasRemaining) {
        updateParts.splice(updateParts.length - 1, 0, 'remaining_until_reorder = ?');
        updateParams.splice(3, 0, remaining_until_reorder);
      }
      updateParams.push(pub_id, beer_id);

      const updateSql = `UPDATE pubhasbeer SET ${updateParts.join(', ')} WHERE pub_id = ? AND beer_id = ?`;
      const [updateRes] = await pool.query(updateSql, updateParams);
      if (updateRes.affectedRows > 0) return res.json({ pub_id, beer_id });

      // Insert fallback: build insert without generated column if necessary
      const insertCols = ['pub_id', 'beer_id', 'quantity_available', 'reorder_threshold', 'storage_location'];
      const insertPlaceholders = ['?', '?', '?', '?', '?'];
      const insertParams = [pub_id, beer_id, quantity_available || 0, reorder_threshold || null, storage_location || null];
      if (hasRemaining) {
        insertCols.push('remaining_until_reorder');
        insertPlaceholders.push('?');
        insertParams.push(remaining_until_reorder);
      }
      insertCols.push('last_updated');
      insertPlaceholders.push('NOW()');

      const insertSql = `INSERT INTO pubhasbeer (${insertCols.join(', ')}) VALUES (${insertPlaceholders.join(', ')})`;
      await pool.query(insertSql, insertParams);
      return res.json({ pub_id, beer_id });
    } catch (e) {
      console.error("upsertPubHasBeer fallback error", e);
      return res.status(500).json({ error: "Database error" });
    }
  }
};

// GET /api/admin/enums?table=...&column=...
export const getEnums = async (req, res) => {
  try {
    const { table, column } = req.query;
    const schemaQuery = `SELECT DATABASE() AS dbName`;
    const [[{ dbName }]] = await pool.query(schemaQuery);
    const schema = dbName;

    const parseEnum = (columnType) => {
      if (!columnType) return [];
      const m = columnType.match(/^enum\((.*)\)$/i);
      if (!m) return [];
      const inner = m[1];
      // split on ',' that separate quoted values
      const parts = inner.split(/','/).map((v) => v.replace(/^'+|'+$/g, ""));
      return parts;
    };

    if (table && column) {
      const [[col]] = await pool.query(
        `SELECT COLUMN_TYPE FROM information_schema.columns WHERE table_schema = ? AND table_name = ? AND column_name = ? LIMIT 1`,
        [schema, table, column]
      );
      if (!col || !col.COLUMN_TYPE) return res.status(404).json({ error: 'Not found' });
      return res.json({ table, column, values: parseEnum(col.COLUMN_TYPE) });
    }

    // no specific table/column requested — return a map for common enums
    const targets = [
      { table: 'beer', column: 'container_kind' },
      { table: 'orders', column: 'status' },
      { table: 'orders', column: 'payment_method' },
    ];
    const result = {};
    for (const t of targets) {
      try {
        const [[col]] = await pool.query(
          `SELECT COLUMN_TYPE FROM information_schema.columns WHERE table_schema = ? AND table_name = ? AND column_name = ? LIMIT 1`,
          [schema, t.table, t.column]
        );
        result[`${t.table}.${t.column}`] = col && col.COLUMN_TYPE ? parseEnum(col.COLUMN_TYPE) : [];
      } catch (e) {
        result[`${t.table}.${t.column}`] = [];
      }
    }
    return res.json(result);
  } catch (err) {
    console.error('getEnums error', err);
    return res.status(500).json({ error: 'Database error' });
  }
};

// Get all employees
export const getEmployees = async (req, res) => {
  try {
    const { pub_id } = req.query;
    let sql = `
      SELECT e.employee_id, e.first_name, e.last_name, e.email, e.phone, e.position, e.shift,
             e.hire_date, e.salary, e.pub_id, p.name as pub_name
      FROM employee e
      LEFT JOIN pub p ON e.pub_id = p.pub_id
    `;
    const params = [];

    if (pub_id) {
      sql += ` WHERE e.pub_id = ?`;
      params.push(pub_id);
    }

    sql += ` ORDER BY e.last_name, e.first_name`;

    const [rows] = await pool.query(sql, params);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
};

// Create a new employee
export const createEmployee = async (req, res) => {
  const { first_name, last_name, email, phone, position, shift, hire_date, salary, pub_id } = req.body;

  if (!first_name || !last_name) {
    return res.status(400).json({ error: "first_name and last_name are required" });
  }

  try {
    const [result] = await pool.query(
      `INSERT INTO employee (first_name, last_name, email, phone, position, shift, hire_date, salary, pub_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [first_name, last_name, email || null, phone || null, position || null, shift || null, hire_date || null, salary || null, pub_id || null]
    );
    const employeeId = result.insertId;
    res.status(201).json({ employee_id: employeeId, message: "Employee created successfully" });
  } catch (err) {
    console.error(err);
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: "Email already exists" });
    }
    res.status(500).json({ error: "Database error" });
  }
};

// Update an employee
export const updateEmployee = async (req, res) => {
  const employeeId = req.params.id;
  const { first_name, last_name, email, phone, position, shift, hire_date, salary, pub_id } = req.body;

  if (!first_name || !last_name) {
    return res.status(400).json({ error: "first_name and last_name are required" });
  }

  try {
    const [result] = await pool.query(
      `UPDATE employee SET first_name = ?, last_name = ?, email = ?, phone = ?, position = ?,
       shift = ?, hire_date = ?, salary = ?, pub_id = ? WHERE employee_id = ?`,
      [first_name, last_name, email || null, phone || null, position || null, shift || null, hire_date || null, salary || null, pub_id || null, employeeId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Employee not found" });
    }

    res.json({ employee_id: Number(employeeId), message: "Employee updated successfully" });
  } catch (err) {
    console.error(err);
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: "Email already exists" });
    }
    res.status(500).json({ error: "Database error" });
  }
};

// Delete an employee
export const deleteEmployee = async (req, res) => {
  const employeeId = req.params.id;

  try {
    const [result] = await pool.query(`DELETE FROM employee WHERE employee_id = ?`, [employeeId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Employee not found" });
    }

    res.json({ employee_id: Number(employeeId), message: "Employee deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
};

// Handle uploaded beer image (multer stores the file already)
export const uploadBeerImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    // The storage was configured to place the file under public/images/beers/<beerId>.<ext>
    const filename = req.file.filename;
    const url = `/images/beers/${filename}`; // served by express static in app.js
    return res.json({ url, filename });
  } catch (err) {
    console.error('uploadBeerImage error', err);
    return res.status(500).json({ error: 'Upload failed' });
  }
};

// Get suppliers that supply a specific brand
export const getSuppliersForBrand = async (req, res) => {
  const { brandId } = req.params;

  if (!brandId) {
    return res.status(400).json({ error: "brandId is required" });
  }

  try {
    const [rows] = await pool.query(
      `SELECT s.supplier_id, s.name, s.contact_person, s.email, s.phone,
              s.street, s.city, s.postal_code, s.country, s.afm,
              bss.supply_price
       FROM supplier s
       JOIN brandsuppliedbysupplier bss ON s.supplier_id = bss.supplier_id
       WHERE bss.brand_id = ?
       ORDER BY bss.supply_price ASC`,
      [brandId]
    );

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
};

// Place an order with a supplier
export const placeSupplierOrder = async (req, res) => {
  const { pub_id, supplier_id, beer_id, quantity, supply_price } = req.body;

  if (!pub_id || !supplier_id || !beer_id || !quantity || typeof supply_price === "undefined") {
    return res.status(400).json({ error: "pub_id, supplier_id, beer_id, quantity, and supply_price are required" });
  }

  if (Number(quantity) <= 0) {
    return res.status(400).json({ error: "quantity must be positive" });
  }

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // Check if supplier supplies this beer (via brand)
    const [supplierCheck] = await conn.query(
      `SELECT b.brand_id, b.name as beer_name, br.name as brand_name
       FROM beer b
       JOIN brand br ON b.brand_id = br.brand_id
       JOIN brandsuppliedbysupplier bss ON br.brand_id = bss.brand_id
       WHERE b.beer_id = ? AND bss.supplier_id = ?`,
      [beer_id, supplier_id]
    );

    if (supplierCheck.length === 0) {
      await conn.rollback();
      return res.status(400).json({ error: "Supplier does not supply this beer" });
    }

    const beerInfo = supplierCheck[0];

    // Calculate total amount
    const totalAmount = Number(supply_price) * Number(quantity);

    // Insert into supplierorder table
    const [result] = await conn.query(
      `INSERT INTO supplierorder (order_date, status, total_cost, supplier_id, pub_id)
       VALUES (CURDATE(), 'pending', ?, ?, ?)`,
      [totalAmount, supplier_id, pub_id]
    );

    await conn.commit();

    res.json({
      message: "Supplier order placed successfully",
      order: {
        supplier_order_id: result.insertId,
        supplier_id,
        beer_id,
        beer_name: beerInfo.beer_name,
        brand_name: beerInfo.brand_name,
        quantity: Number(quantity),
        supply_price: Number(supply_price),
        total_amount: totalAmount,
        order_date: new Date().toISOString().split('T')[0],
        status: 'pending'
      }
    });

  } catch (err) {
    await conn.rollback();
    console.error(err);
    res.status(500).json({ error: "Database error" });
  } finally {
    conn.release();
  }
};

export const getSupplierOrders = async (req, res) => {
  const conn = await pool.getConnection();
  try {
    const [orders] = await conn.query(
      `SELECT so.*, s.name as supplier_name, p.name as pub_name, p.pub_id
       FROM supplierorder so
       LEFT JOIN supplier s ON so.supplier_id = s.supplier_id
       LEFT JOIN pub p ON so.pub_id = p.pub_id
       ORDER BY so.supplier_order_id DESC`
    );
    res.json(orders || []);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  } finally {
    conn.release();
  }
};

export const updateSupplierOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status, reason_pending, expected_delivery_date } = req.body;

  if (!id) {
    return res.status(400).json({ error: "id is required" });
  }

  const conn = await pool.getConnection();
  try {
    const updates = [];
    const params = [];

    if (status !== undefined) {
      updates.push(`status = ?`);
      params.push(status);
    }

    if (reason_pending !== undefined) {
      updates.push(`reason_pending = ?`);
      params.push(reason_pending || null);
    }

    if (expected_delivery_date !== undefined) {
      updates.push(`expected_delivery_date = ?`);
      params.push(expected_delivery_date || null);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: "At least one field to update is required" });
    }

    let query = `UPDATE supplierorder SET ${updates.join(", ")} WHERE supplier_order_id = ?`;
    params.push(id);

    await conn.query(query, params);

    res.json({ message: "Order updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  } finally {
    conn.release();
  }
};
