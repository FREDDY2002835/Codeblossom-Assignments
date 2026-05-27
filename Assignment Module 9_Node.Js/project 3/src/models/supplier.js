const pool = require('../db/pool');

const getAllSuppliers = async () => {
  const { rows } = await pool.query(`
    SELECT s.*, COUNT(i.id)::int AS item_count
    FROM suppliers s
    LEFT JOIN items i ON i.supplier_id = s.id
    GROUP BY s.id
    ORDER BY s.name
  `);
  return rows;
};

const getSupplierById = async (id) => {
  const { rows } = await pool.query('SELECT * FROM suppliers WHERE id = $1', [id]);
  return rows[0];
};

const createSupplier = async ({ name, contact_email, country }) => {
  const { rows } = await pool.query(
    'INSERT INTO suppliers (name, contact_email, country) VALUES ($1, $2, $3) RETURNING *',
    [name, contact_email, country]
  );
  return rows[0];
};

const updateSupplier = async (id, { name, contact_email, country }) => {
  const { rows } = await pool.query(
    'UPDATE suppliers SET name = $1, contact_email = $2, country = $3 WHERE id = $4 RETURNING *',
    [name, contact_email, country, id]
  );
  return rows[0];
};

const deleteSupplier = async (id) => {
  await pool.query('DELETE FROM suppliers WHERE id = $1', [id]);
};

const getItemsBySupplier = async (supplierId) => {
  const { rows } = await pool.query(`
    SELECT i.*, c.name AS category_name
    FROM items i
    LEFT JOIN categories c ON c.id = i.category_id
    WHERE i.supplier_id = $1
    ORDER BY i.name
  `, [supplierId]);
  return rows;
};

module.exports = { getAllSuppliers, getSupplierById, createSupplier, updateSupplier, deleteSupplier, getItemsBySupplier };