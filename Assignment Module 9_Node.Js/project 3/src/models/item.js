const pool = require('../db/pool');

const getAllItems = async () => {
  const { rows } = await pool.query(`
    SELECT i.*, c.name AS category_name, s.name AS supplier_name
    FROM items i
    JOIN categories c ON c.id = i.category_id
    LEFT JOIN suppliers s ON s.id = i.supplier_id
    ORDER BY i.name
  `);
  return rows;
};

const getItemById = async (id) => {
  const { rows } = await pool.query(`
    SELECT i.*, c.name AS category_name, s.name AS supplier_name
    FROM items i
    JOIN categories c ON c.id = i.category_id
    LEFT JOIN suppliers s ON s.id = i.supplier_id
    WHERE i.id = $1
  `, [id]);
  return rows[0];
};

const createItem = async ({ name, description, category_id, supplier_id, quantity, price, unit, low_stock_threshold }) => {
  const { rows } = await pool.query(
    `INSERT INTO items (name, description, category_id, supplier_id, quantity, price, unit, low_stock_threshold)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
    [name, description, category_id, supplier_id || null, quantity, price, unit, low_stock_threshold]
  );
  return rows[0];
};

const updateItem = async (id, { name, description, category_id, supplier_id, quantity, price, unit, low_stock_threshold }) => {
  const { rows } = await pool.query(
    `UPDATE items SET name=$1, description=$2, category_id=$3, supplier_id=$4,
     quantity=$5, price=$6, unit=$7, low_stock_threshold=$8 WHERE id=$9 RETURNING *`,
    [name, description, category_id, supplier_id || null, quantity, price, unit, low_stock_threshold, id]
  );
  return rows[0];
};

const deleteItem = async (id) => {
  await pool.query('DELETE FROM items WHERE id = $1', [id]);
};

const getLowStockItems = async () => {
  const { rows } = await pool.query(`
    SELECT i.*, c.name AS category_name, s.name AS supplier_name
    FROM items i
    JOIN categories c ON c.id = i.category_id
    LEFT JOIN suppliers s ON s.id = i.supplier_id
    WHERE i.quantity <= i.low_stock_threshold
    ORDER BY i.quantity ASC
  `);
  return rows;
};

const getInventoryStats = async () => {
  const { rows } = await pool.query(`
    SELECT
      COUNT(*)::int AS total_items,
      SUM(quantity * price) AS total_value,
      COUNT(CASE WHEN quantity <= low_stock_threshold THEN 1 END)::int AS low_stock_count
    FROM items
  `);
  return rows[0];
};

module.exports = { getAllItems, getItemById, createItem, updateItem, deleteItem, getLowStockItems, getInventoryStats };