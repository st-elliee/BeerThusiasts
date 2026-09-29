import { pool } from "../db.js";

export const getBrands = async (req, res) => {
  try {
    const [[{ dbName }]] = await pool.query(`SELECT DATABASE() AS dbName`);
    const schema = dbName;

    // 1) Look for dedicated brand-like tables and return sensible columns
    const brandTables = ['brand', 'brands', 'brewery', 'breweries'];
    for (const tbl of brandTables) {
      const [tblRows] = await pool.query(
        `SELECT TABLE_NAME FROM information_schema.tables WHERE table_schema = ? AND table_name = ? LIMIT 1`,
        [schema, tbl]
      );
      if (tblRows && tblRows.length > 0) {
        const [cols] = await pool.query(
          `SELECT COLUMN_NAME FROM information_schema.columns WHERE table_schema = ? AND table_name = ?`,
          [schema, tbl]
        );
        const colNames = cols.map((c) => c.COLUMN_NAME.toLowerCase());
        const idCol = colNames.includes('brand_id') ? 'brand_id' : (colNames.includes('id') ? 'id' : null);
        const nameCol = colNames.includes('brand_name') ? 'brand_name' : (colNames.includes('name') ? 'name' : null);
        const countryCol = colNames.includes('country') ? 'country' : (colNames.includes('country_of_origin') ? 'country_of_origin' : null);

        const selectParts = [];
        if (idCol) selectParts.push(`${idCol} AS brand_id`);
        if (nameCol) selectParts.push(`${nameCol} AS brand_name`);
        if (countryCol) selectParts.push(`${countryCol} AS country`);
        const select = selectParts.length ? selectParts.join(', ') : '*';

        const sql = `SELECT ${select} FROM ${tbl}`;
        const [rows] = await pool.query(sql);
        return res.json(rows);
      }
    }

    // 2) No brand table — inspect `beer` table for brand-like columns
    const [beerTable] = await pool.query(
      `SELECT TABLE_NAME FROM information_schema.tables WHERE table_schema = ? AND table_name = 'beer' LIMIT 1`,
      [schema]
    );
    if (beerTable && beerTable.length > 0) {
      const [cols] = await pool.query(
        `SELECT COLUMN_NAME FROM information_schema.columns WHERE table_schema = ? AND table_name = 'beer'`,
        [schema]
      );
      const colNames = cols.map((c) => c.COLUMN_NAME.toLowerCase());
      const nameCandidates = ['brand_name', 'brand', 'brewery', 'manufacturer', 'producer'];
      for (const cand of nameCandidates) {
        if (colNames.includes(cand)) {
          const sql = `SELECT DISTINCT ${cand} AS brand_name FROM beer WHERE ${cand} IS NOT NULL`;
          const [rows] = await pool.query(sql);
          return res.json(rows.map((r) => ({ brand_name: r.brand_name })));
        }
      }
      if (colNames.includes('brand_id')) {
        const [rows] = await pool.query(`SELECT DISTINCT brand_id FROM beer WHERE brand_id IS NOT NULL`);
        return res.json(rows.map((r) => ({ brand_id: r.brand_id })));
      }
    }

    // 3) Nothing usable — return empty array so frontend can handle gracefully
    console.warn('No brand information found in schema');
    return res.json([]);
  } catch (err) {
    console.error('brands controller error', err);
    return res.status(500).json({ error: 'Database error' });
  }
};
