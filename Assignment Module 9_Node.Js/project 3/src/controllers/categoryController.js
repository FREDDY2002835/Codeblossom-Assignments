const Category = require('../models/category');

exports.list = async (req, res) => {
  const categories = await Category.getAllCategories();
  res.render('categories/index', { title: 'Categories', categories });
};

exports.show = async (req, res) => {
  const category = await Category.getCategoryById(req.params.id);
  if (!category) return res.status(404).render('404', { title: 'Not Found' });
  const items = await Category.getItemsInCategory(req.params.id);
  res.render('categories/show', { title: category.name, category, items });
};

exports.newForm = (req, res) => {
  res.render('categories/form', { title: 'New Category', category: null, errors: [] });
};

exports.create = async (req, res) => {
  const { name, description } = req.body;
  const errors = [];
  if (!name || name.trim() === '') errors.push('Name is required.');
  if (errors.length) return res.render('categories/form', { title: 'New Category', category: { name, description }, errors });
  try {
    await Category.createCategory({ name: name.trim(), description });
    res.redirect('/categories');
  } catch (e) {
    if (e.code === '23505') errors.push('A category with that name already exists.');
    else errors.push('Something went wrong. Please try again.');
    res.render('categories/form', { title: 'New Category', category: { name, description }, errors });
  }
};

exports.editForm = async (req, res) => {
  const category = await Category.getCategoryById(req.params.id);
  if (!category) return res.status(404).render('404', { title: 'Not Found' });
  res.render('categories/form', { title: 'Edit Category', category, errors: [] });
};

exports.update = async (req, res) => {
  const { name, description, admin_password } = req.body;
  if (admin_password !== process.env.ADMIN_PASSWORD) {
    const category = await Category.getCategoryById(req.params.id);
    return res.render('categories/form', { title: 'Edit Category', category: { ...category, name, description }, errors: ['Incorrect admin password.'] });
  }
  const errors = [];
  if (!name || name.trim() === '') errors.push('Name is required.');
  if (errors.length) {
    const category = await Category.getCategoryById(req.params.id);
    return res.render('categories/form', { title: 'Edit Category', category: { ...category, name, description }, errors });
  }
  try {
    await Category.updateCategory(req.params.id, { name: name.trim(), description });
    res.redirect(`/categories/${req.params.id}`);
  } catch (e) {
    if (e.code === '23505') errors.push('A category with that name already exists.');
    else errors.push('Something went wrong.');
    const category = await Category.getCategoryById(req.params.id);
    res.render('categories/form', { title: 'Edit Category', category: { ...category, name, description }, errors });
  }
};

exports.delete = async (req, res) => {
  const { admin_password } = req.body;
  if (admin_password !== process.env.ADMIN_PASSWORD) {
    return res.redirect(`/categories/${req.params.id}?error=wrong_password`);
  }
  const items = await Category.getItemsInCategory(req.params.id);
  if (items.length > 0) {
    return res.redirect(`/categories/${req.params.id}?error=has_items`);
  }
  await Category.deleteCategory(req.params.id);
  res.redirect('/categories');
};