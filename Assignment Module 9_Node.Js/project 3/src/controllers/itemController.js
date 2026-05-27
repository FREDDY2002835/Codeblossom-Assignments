const Item = require('../models/item');
const Category = require('../models/category');
const Supplier = require('../models/supplier');

exports.list = async (req, res) => {
  const items = await Item.getAllItems();
  res.render('items/index', { title: 'All Items', items });
};

exports.show = async (req, res) => {
  const item = await Item.getItemById(req.params.id);
  if (!item) return res.status(404).render('404', { title: 'Not Found' });
  res.render('items/show', { title: item.name, item });
};

exports.newForm = async (req, res) => {
  const [categories, suppliers] = await Promise.all([Category.getAllCategories(), Supplier.getAllSuppliers()]);
  res.render('items/form', { title: 'New Item', item: null, categories, suppliers, errors: [] });
};

exports.create = async (req, res) => {
  const { name, description, category_id, supplier_id, quantity, price, unit, low_stock_threshold } = req.body;
  const errors = [];
  if (!name || name.trim() === '') errors.push('Name is required.');
  if (!category_id) errors.push('Category is required.');
  if (isNaN(parseFloat(quantity)) || parseFloat(quantity) < 0) errors.push('Quantity must be a non-negative number.');
  if (isNaN(parseFloat(price)) || parseFloat(price) < 0) errors.push('Price must be a non-negative number.');
  if (errors.length) {
    const [categories, suppliers] = await Promise.all([Category.getAllCategories(), Supplier.getAllSuppliers()]);
    return res.render('items/form', { title: 'New Item', item: req.body, categories, suppliers, errors });
  }
  await Item.createItem({ name: name.trim(), description, category_id, supplier_id, quantity, price, unit: unit || 'units', low_stock_threshold: low_stock_threshold || 10 });
  res.redirect('/items');
};

exports.editForm = async (req, res) => {
  const [item, categories, suppliers] = await Promise.all([
    Item.getItemById(req.params.id),
    Category.getAllCategories(),
    Supplier.getAllSuppliers()
  ]);
  if (!item) return res.status(404).render('404', { title: 'Not Found' });
  res.render('items/form', { title: 'Edit Item', item, categories, suppliers, errors: [] });
};

exports.update = async (req, res) => {
  const { name, description, category_id, supplier_id, quantity, price, unit, low_stock_threshold, admin_password } = req.body;
  if (admin_password !== process.env.ADMIN_PASSWORD) {
    const [item, categories, suppliers] = await Promise.all([Item.getItemById(req.params.id), Category.getAllCategories(), Supplier.getAllSuppliers()]);
    return res.render('items/form', { title: 'Edit Item', item: { ...item, ...req.body }, categories, suppliers, errors: ['Incorrect admin password.'] });
  }
  const errors = [];
  if (!name || name.trim() === '') errors.push('Name is required.');
  if (!category_id) errors.push('Category is required.');
  if (isNaN(parseFloat(quantity)) || parseFloat(quantity) < 0) errors.push('Quantity must be non-negative.');
  if (isNaN(parseFloat(price)) || parseFloat(price) < 0) errors.push('Price must be non-negative.');
  if (errors.length) {
    const [item, categories, suppliers] = await Promise.all([Item.getItemById(req.params.id), Category.getAllCategories(), Supplier.getAllSuppliers()]);
    return res.render('items/form', { title: 'Edit Item', item: { ...item, ...req.body }, categories, suppliers, errors });
  }
  await Item.updateItem(req.params.id, { name: name.trim(), description, category_id, supplier_id, quantity, price, unit: unit || 'units', low_stock_threshold: low_stock_threshold || 10 });
  res.redirect(`/items/${req.params.id}`);
};

exports.delete = async (req, res) => {
  const { admin_password } = req.body;
  if (admin_password !== process.env.ADMIN_PASSWORD) {
    return res.redirect(`/items/${req.params.id}?error=wrong_password`);
  }
  await Item.deleteItem(req.params.id);
  res.redirect('/items');
};