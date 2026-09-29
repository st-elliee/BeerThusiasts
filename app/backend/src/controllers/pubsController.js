import { pool } from "../db.js";

export const getPubs = async (req, res) => {
  try {
    const [rows] = await pool.query(`SELECT * FROM pub`);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
};

export const createPub = async (req, res) => {
  const { name, manager_name, phone, street, city, postal_code, country } = req.body;
  
  if (!name) {
    return res.status(400).json({ error: "Pub name is required" });
  }

  try {
    const [result] = await pool.query(
      `INSERT INTO pub (name, manager_name, phone, street, city, postal_code, country) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [name, manager_name || null, phone || null, street || null, city || null, postal_code || null, country || null]
    );
    res.status(201).json({ pub_id: result.insertId, name, manager_name, phone, street, city, postal_code, country });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
};

export const updatePub = async (req, res) => {
  const pubId = req.params.id;
  const { name, manager_name, phone, street, city, postal_code, country } = req.body;
  
  if (!name) {
    return res.status(400).json({ error: "Pub name is required" });
  }

  try {
    const [result] = await pool.query(
      `UPDATE pub SET name = ?, manager_name = ?, phone = ?, street = ?, city = ?, postal_code = ?, country = ? WHERE pub_id = ?`,
      [name, manager_name || null, phone || null, street || null, city || null, postal_code || null, country || null, pubId]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Pub not found" });
    }
    
    res.json({ pub_id: Number(pubId), name, manager_name, phone, street, city, postal_code, country });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
};

export const getPubsNeedsRestock = async (req, res) => {
  try {
    const [[{ dbName }]] = await pool.query(`SELECT DATABASE() AS dbName`);
    const schema = dbName;

    // Inspect available columns for pub, beer and pubhasbeer to build a safe query
    const inspect = async (table) => {
      const [cols] = await pool.query(
        `SELECT COLUMN_NAME FROM information_schema.columns WHERE table_schema = ? AND table_name = ?`,
        [schema, table]
      );
      return cols.map((c) => c.COLUMN_NAME.toLowerCase());
    };

    const pubCols = await inspect('pub').catch(() => []);
    const beerCols = await inspect('beer').catch(() => []);
    const phCols = await inspect('pubhasbeer').catch(() => []);

    const pubNameCols = ['pub_name', 'name', 'pubname'].filter((c) => pubCols.includes(c));
    const beerNameCols = ['name', 'beer_name', 'title'].filter((c) => beerCols.includes(c));

    const selectParts = ['ph.pub_id'];
    if (pubNameCols.length > 0) selectParts.push(`COALESCE(${pubNameCols.map((c) => `p.${c}`).join(', ')}) AS pub_name`);
    selectParts.push('ph.beer_id');
    if (beerNameCols.length > 0) selectParts.push(`COALESCE(${beerNameCols.map((c) => `b.${c}`).join(', ')}) AS beer_name`);
    if (phCols.includes('quantity_available')) selectParts.push('ph.quantity_available');
    if (phCols.includes('reorder_threshold')) selectParts.push('ph.reorder_threshold');
    if (phCols.includes('remaining_until_reorder')) selectParts.push('ph.remaining_until_reorder');

    const whereParts = [];
    if (phCols.includes('remaining_until_reorder')) {
      whereParts.push('(ph.remaining_until_reorder IS NOT NULL AND ph.remaining_until_reorder <= 0)');
    }
    if (phCols.includes('reorder_threshold') && phCols.includes('quantity_available')) {
      whereParts.push('(ph.reorder_threshold IS NOT NULL AND ph.quantity_available <= ph.reorder_threshold)');
    }

    if (whereParts.length === 0) {
      // No meaningful restock criteria available
      return res.json([]);
    }

    const sql = `
      SELECT ${selectParts.join(', ')}
      FROM pubhasbeer ph
      LEFT JOIN pub p ON ph.pub_id = p.pub_id
      LEFT JOIN beer b ON ph.beer_id = b.beer_id
      WHERE ${whereParts.join(' OR ')}
      ORDER BY ${phCols.includes('remaining_until_reorder') ? 'ph.remaining_until_reorder ASC,' : ''} ${phCols.includes('quantity_available') ? 'ph.quantity_available ASC' : 'ph.beer_id ASC'}
    `;

    const [rows] = await pool.query(sql);
    res.json(rows);
  } catch (err) {
    console.error('getPubsNeedsRestock error', err);
    res.status(500).json({ error: 'Database error' });
  }
};
