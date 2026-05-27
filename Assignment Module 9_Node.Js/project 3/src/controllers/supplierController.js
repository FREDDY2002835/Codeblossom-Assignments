const Supplier = require('../models/supplier');

exports.list = async (req, res) => {
  const suppliers = await Supplier.getAllSuppliers();
  res.render('suppliers/index', { title: 'Suppliers', suppliers });
};

exports.show = async (req, res) => {
  const supplier = await Supplier.getSupplierById(req.params.id);
  if (!supplier) return res.status(404).render('404', { title: 'Not Found' });
  const items = await Supplier.getItemsBySupplier(req.params.id);
  res.render('suppliers/show', { title: supplier.name, supplier, items });
};

exports.newForm = (req, res) => {
  res.render('suppliers/form', { title: 'New Supplier', supplier: null, errors: [] });
};

exports.create = async (req, res) => {
  const { name, contact_email, country } = req.body;
  const errors = [];
  if (!name || name.trim() === '') errors.push('Name is required.');
  if (errors.length) return res.render('suppliers/form', { title: 'New Supplier', supplier: { name, contact_email, country }, errors });
  try {
    await Supplier.createSupplier({ name: name.trim(), contact_email, country });
    res.redirect('/suppliers');
  } catch (e) {
    if (e.code === '23505') errors.push('A supplier with that name already exists.');
    else errors.push('Something went wrong.');
    res.render('suppliers/form', { title: 'New Supplier', supplier: { name, contact_email, country }, errors });
  }
};

exports.editForm = async (req, res) => {
  const supplier = await Supplier.getSupplierById(req.params.id);
  if (!supplier) return res.status(404).render('404', { title: 'Not Found' });
  res.render('suppliers/form', { title: 'Edit Supplier', supplier, errors: [] });
};

exports.update = async (req, res) => {
  const { name, contact_email, country, admin_password } = req.body;
  if (admin_password !== process.env.ADMIN_PASSWORD) {
    const supplier = await Supplier.getSupplierById(req.params.id);
    return res.render('suppliers/form', { title: 'Edit Supplier', supplier: { ...supplier, name, contact_email, country }, errors: ['Incorrect admin password.'] });
  }
  const errors = [];
  if (!name || name.trim() === '') errors.push('Name is required.');
  if (errors.length) {
    const supplier = await Supplier.getSupplierById(req.params.id);
    return res.render('suppliers/form', { title: 'Edit Supplier', supplier: { ...supplier, name, contact_email, country }, errors });
  }
  try {
    await Supplier.updateSupplier(req.params.id, { name: name.trim(), contact_email, country });
    res.redirect(`/suppliers/${req.params.id}`);
  } catch (e) {
    if (e.code === '23505') errors.push('A supplier with that name already exists.');
    else errors.push('Something went wrong.');
    const supplier = await Supplier.getSupplierById(req.params.id);
    res.render('suppliers/form', { title: 'Edit Supplier', supplier: { ...supplier, name, contact_email, country }, errors });
  }
};

exports.delete = async (req, res) => {
  const { admin_password } = req.body;
  if (admin_password !== process.env.ADMIN_PASSWORD) {
    return res.redirect(`/suppliers/${req.params.id}?error=wrong_password`);
  }
  await Supplier.deleteSupplier(req.params.id);
  res.redirect('/suppliers');
};