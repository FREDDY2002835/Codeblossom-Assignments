const pool = require('../db/pool');

const getAllCategories = async () => {
  const { rows } = await pool.query(`
    SELECT c.*, COUNT(i.id)::int AS item_count
    FROM categories c
    LEFT JOIN items i ON i.category_id = c.id
    GROUP BY c.id
    ORDER BY c.name
  `);
  return rows;
};

const getCategoryById = async (id) => {
  const { rows } = await pool.query('SELECT * FROM categories WHERE id = $1', [id]);
  return rows[0];
};

const createCategory = async ({ name, description }) => {
  const { rows } = await pool.query(
    'INSERT INTO categories (name, description) VALUES ($1, $2) RETURNING *',
    [name, description]
  );
  return rows[0];
};

const updateCategory = async (id, { name, description }) => {
  const { rows } = await pool.query(
    'UPDATE categories SET name = $1, description = $2 WHERE id = $3 RETURNING *',
    [name, description, id]
  );
  return rows[0];
};

const deleteCategory = async (id) => {
  await pool.query('DELETE FROM categories WHERE id = $1', [id]);
};

const getItemsInCategory = async (categoryId) => {
  const { rows } = await pool.query(`
    SELECT i.*, s.name AS supplier_name
    FROM items i
    LEFT JOIN suppliers s ON s.id = i.supplier_id
    WHERE i.category_id = $1
    ORDER BY i.name
  `, [categoryId]);
  return rows;
};

module.exports = { getAllCategories, getCategoryById, createCategory, updateCategory, deleteCategory, getItemsInCategory };