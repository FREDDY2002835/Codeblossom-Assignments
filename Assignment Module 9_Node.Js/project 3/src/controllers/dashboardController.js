const Item = require('../models/item');
const Category = require('../models/category');
const Supplier = require('../models/supplier');

exports.dashboard = async (req, res) => {
  const [stats, lowStock, categories, suppliers] = await Promise.all([
    Item.getInventoryStats(),
    Item.getLowStockItems(),
    Category.getAllCategories(),
    Supplier.getAllSuppliers()
  ]);
  res.render('dashboard', { title: 'Dashboard', stats, lowStock, categories, suppliers });
};