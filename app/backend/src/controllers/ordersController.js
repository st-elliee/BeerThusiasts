import { pool } from "../db.js";

// POST /api/orders
// Body: { customer_id, pub_id, items: [{ beer_id, quantity }] }
// Creates an order, inserts order items, checks and decrements pub inventory (pubhasbeer).
export const postOrder = async (req, res) => {
  // Schema provided: orders(order_id, status, customer_id, total_amount, order_date, payment_method)
  // orderhasbeer(order_id, line_number, beer_id, quantity, price_per_unit, line_total)
  const { customer_id, items, payment_method, pub_id } = req.body;

  if (!customer_id || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "customer_id and items are required" });
  }

  for (const it of items) {
    if (!it.beer_id || !it.quantity || Number(it.quantity) <= 0) {
      return res.status(400).json({ error: "Each item must contain beer_id and positive quantity" });
    }
  }

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const beerIds = items.map((i) => i.beer_id);
    const placeholders = beerIds.map(() => "?").join(",");
    const [priceRows] = await conn.query(
      `SELECT beer_id, price FROM beer WHERE beer_id IN (${placeholders})`,
      beerIds
    );

    const priceMap = new Map(priceRows.map((r) => [r.beer_id, Number(r.price)]));

    let total = 0;
    for (const it of items) {
      const price = priceMap.get(it.beer_id);
      if (typeof price === "undefined") {
        await conn.rollback();
        return res.status(400).json({ error: `Beer not found: ${it.beer_id}` });
      }
      total += price * Number(it.quantity);
    }

    // If pub_id provided, check inventory (but do not decrement yet, as order starts pending)
    if (pub_id) {
      for (const it of items) {
        const [invRows] = await conn.query(
          `SELECT quantity_available FROM pubhasbeer WHERE pub_id = ? AND beer_id = ?`,
          [pub_id, it.beer_id]
        );
        if (!invRows || invRows.length === 0) {
          await conn.rollback();
          return res.status(400).json({ error: `Beer ${it.beer_id} is not available at pub ${pub_id}` });
        }
        const available = Number(invRows[0].quantity_available);
        if (available < Number(it.quantity)) {
          await conn.rollback();
          return res.status(400).json({ error: `Insufficient inventory for beer ${it.beer_id}` });
        }
        // Note: Inventory will be decremented when order status changes to 'completed'
      }
    }

    // Insert into orders using actual column names.
    // Some schemas do not have AUTO_INCREMENT on order_id; compute next id under transaction.
    const [[{ nextId }]] = await conn.query(
      `SELECT COALESCE(MAX(order_id), 0) + 1 AS nextId FROM orders FOR UPDATE`
    );
    const orderId = nextId;
    await conn.query(
      `INSERT INTO orders (order_id, customer_id, pub_id, order_date, total_amount, payment_method) VALUES (?, ?, ?, NOW(), ?, ?)`,
      [orderId, customer_id, pub_id || null, total, payment_method || null]
    );

    // Insert order lines with line_number, price_per_unit, line_total
    for (let i = 0; i < items.length; i++) {
      const it = items[i];
      const price = priceMap.get(it.beer_id);
      const lineTotal = price * Number(it.quantity);
      const lineNumber = i + 1;
      await conn.query(
        `INSERT INTO orderhasbeer (order_id, line_number, beer_id, quantity, price_per_unit, line_total) VALUES (?, ?, ?, ?, ?, ?)`,
        [orderId, lineNumber, it.beer_id, it.quantity, price, lineTotal]
      );
    }

    // Calculate and update loyalty points: total * 10, rounded up
    const loyaltyPointsToAdd = Math.ceil(total * 10);
    await conn.query(
      `UPDATE customer SET loyalty_points = loyalty_points + ? WHERE customer_id = ?`,
      [loyaltyPointsToAdd, customer_id]
    );

    // Get current loyalty points after update
    const [[customerData]] = await conn.query(
      `SELECT loyalty_points FROM customer WHERE customer_id = ?`,
      [customer_id]
    );
    const currentLoyaltyPoints = customerData?.loyalty_points || 0;

    await conn.commit();
    res.status(201).json({ 
      order_id: orderId, 
      total_amount: total, 
      pub_id: pub_id || null, 
      loyalty_points_added: loyaltyPointsToAdd,
      current_loyalty_points: currentLoyaltyPoints
    });
  } catch (err) {
    console.error(err);
    try {
      await conn.rollback();
    } catch (e) {
      console.error("Rollback error", e);
    }
    res.status(500).json({ error: "Database error" });
  } finally {
    conn.release();
  }
};

// GET /api/orders
export const getOrders = async (req, res) => {
  try {
    const { pub_id, status } = req.query;
    let sql = `
      SELECT o.order_id, o.customer_id, o.pub_id, o.order_date, o.total_amount, COALESCE(o.status, 'pending') AS status, o.payment_method
      FROM orders o
    `;
    const params = [];
    const conditions = [];
    if (pub_id) {
      conditions.push(`o.pub_id = ?`);
      params.push(pub_id);
    }
    if (status) {
      conditions.push(`COALESCE(o.status, 'pending') = ?`);
      params.push(status);
    }
    if (conditions.length > 0) {
      sql += ` WHERE ${conditions.join(' AND ')}`;
    }
    sql += ` ORDER BY o.order_id DESC`;
    const [rows] = await pool.query(sql, params);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
};

// PATCH /api/orders/:id/status
export const updateOrderStatus = async (req, res) => {
  const orderId = req.params.id;
  const { status, pub_id } = req.body;
  const allowed = ["pending", "completed", "cancelled"];
  if (!status || !allowed.includes(String(status).toLowerCase())) {
    return res.status(400).json({ error: `Status is required and must be one of: ${allowed.join(", ")}` });
  }

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // Get current status
    const [currentRows] = await conn.query(`SELECT status FROM orders WHERE order_id = ? FOR UPDATE`, [orderId]);
    if (currentRows.length === 0) {
      await conn.rollback();
      return res.status(404).json({ error: "Order not found" });
    }
    const oldStatus = currentRows[0].status;

    // Update status
    await conn.query(`UPDATE orders SET status = ? WHERE order_id = ?`, [status, orderId]);

    // Adjust inventory if pub_id provided
    if (pub_id) {
      const [items] = await conn.query(`SELECT beer_id, quantity FROM orderhasbeer WHERE order_id = ?`, [orderId]);
      for (const item of items) {
        let adjustment = 0;
        if (status === 'completed' && oldStatus !== 'completed') {
          adjustment = -item.quantity; // subtract
        } else if (status === 'cancelled' && oldStatus === 'completed') {
          adjustment = item.quantity; // add back
        }
        if (adjustment !== 0) {
          await conn.query(
            `UPDATE pubhasbeer SET quantity_available = quantity_available + ? WHERE pub_id = ? AND beer_id = ?`,
            [adjustment, pub_id, item.beer_id]
          );
        }
      }
    }

    await conn.commit();
    res.json({ order_id: Number(orderId), status });
  } catch (err) {
    console.error(err);
    try {
      await conn.rollback();
    } catch (e) {
      console.error("Rollback error", e);
    }
    res.status(500).json({ error: "Database error" });
  } finally {
    conn.release();
  }
};

// GET /api/orders/:id/details?pub_id=X
export const getOrderDetails = async (req, res) => {
  const orderId = req.params.id;
  const { pub_id } = req.query;
  try {
    let sql = `
      SELECT oh.line_number, oh.beer_id, b.name as beer_name, oh.quantity, oh.price_per_unit, oh.line_total,
             o.pub_id, p.name as pub_name
      FROM orderhasbeer oh
      JOIN beer b ON oh.beer_id = b.beer_id
      JOIN orders o ON oh.order_id = o.order_id
      LEFT JOIN pub p ON o.pub_id = p.pub_id
      WHERE oh.order_id = ?
      ORDER BY oh.line_number
    `;
    const [rows] = await pool.query(sql, [orderId]);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
};
