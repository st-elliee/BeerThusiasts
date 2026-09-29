import { pool } from "../db.js";

export const getBeers = async (req, res) => {
  try {
    const {
      search,
      brand,
      kind,
      country,
      minAlcohol,
      maxAlcohol,
      sortPrice,
    } = req.query;

    let sql = `
      SELECT 
        b.beer_id,
        b.name AS beer_name,
        b.beer_kind,
        b.alcohol_content,
        b.price,
        b.container_kind,
        b.volume_liters,
        b.brand_id,
        br.name AS brand_name,
        br.country_of_origin
      FROM beer b
      JOIN brand br ON b.brand_id = br.brand_id
      WHERE 1=1
    `;

    const params = [];

    if (search) {
      sql += ` AND b.name LIKE ?`;
      params.push(`%${search}%`);
    }

    if (brand) {
      sql += ` AND br.name = ?`;
      params.push(brand);
    }

    if (kind) {
      sql += ` AND b.beer_kind = ?`;
      params.push(kind);
    }

    if (country) {
      sql += ` AND br.country_of_origin = ?`;
      params.push(country);
    }

    if (minAlcohol) {
      sql += ` AND b.alcohol_content >= ?`;
      params.push(minAlcohol);
    }

    if (maxAlcohol) {
      sql += ` AND b.alcohol_content <= ?`;
      params.push(maxAlcohol);
    }

    if (sortPrice) {
      if (sortPrice === 'asc') {
        sql += ` ORDER BY b.price ASC`;
      } else if (sortPrice === 'desc') {
        sql += ` ORDER BY b.price DESC`;
      }
    }

    const [rows] = await pool.query(sql, params);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
};

export const getBeerById = async (req, res) => {
  try {
    const id = req.params.id;
    const sql = `
      SELECT 
        b.beer_id,
        b.name AS beer_name,
        b.beer_kind,
        b.alcohol_content,
        b.price,
        b.container_kind,
        b.volume_liters,
        br.brand_id,
        br.name AS brand_name,
        br.country_of_origin
      FROM beer b
      JOIN brand br ON b.brand_id = br.brand_id
      WHERE b.beer_id = ?
      LIMIT 1
    `;
    const [rows] = await pool.query(sql, [id]);
    if (!rows || rows.length === 0) return res.status(404).json({ error: "Not found" });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
};
