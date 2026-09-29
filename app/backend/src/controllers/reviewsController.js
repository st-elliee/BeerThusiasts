import { pool } from "../db.js";

export const getReviewsByBeer = async (req, res) => {
  try {
    const beerId = req.params.beerId;
    const sql = `
      SELECT r.customer_id, r.rating, r.comment, c.first_name, c.last_name
      FROM customerreviewsbeer r
      LEFT JOIN customer c ON r.customer_id = c.customer_id
      WHERE r.beer_id = ?
      ORDER BY r.rating DESC
    `;
    const [rows] = await pool.query(sql, [beerId]);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
};

export const postReview = async (req, res) => {
  try {
    const { beerId } = req.params;
    const { customer_id, rating, comment } = req.body;
    if (!customer_id || !rating) {
      return res.status(400).json({ error: "customer_id and rating are required" });
    }
    const sql = `INSERT INTO customerreviewsbeer (customer_id, beer_id, rating, comment) VALUES (?, ?, ?, ?)`;
    const [result] = await pool.query(sql, [customer_id, beerId, rating, comment || null]);
    res.status(201).json({ review_id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
};
