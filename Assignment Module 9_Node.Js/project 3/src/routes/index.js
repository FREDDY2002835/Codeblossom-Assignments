const express = require('express');
const router = express.Router();
const dashboard = require('../controllers/dashboardController');
const categories = require('../controllers/categoryController');
const suppliers = require('../controllers/supplierController');
const items = require('../controllers/itemController');

// Dashboard
router.get('/', dashboard.dashboard);

// Categories
router.get('/categories', categories.list);
router.get('/categories/new', categories.newForm);
router.post('/categories', categories.create);
router.get('/categories/:id', categories.show);
router.get('/categories/:id/edit', categories.editForm);
router.post('/categories/:id', categories.update);
router.post('/categories/:id/delete', categories.delete);

// Suppliers
router.get('/suppliers', suppliers.list);
router.get('/suppliers/new', suppliers.newForm);
router.post('/suppliers', suppliers.create);
router.get('/suppliers/:id', suppliers.show);
router.get('/suppliers/:id/edit', suppliers.editForm);
router.post('/suppliers/:id', suppliers.update);
router.post('/suppliers/:id/delete', suppliers.delete);

// Items
router.get('/items', items.list);
router.get('/items/new', items.newForm);
router.post('/items', items.create);
router.get('/items/:id', items.show);
router.get('/items/:id/edit', items.editForm);
router.post('/items/:id', items.update);
router.post('/items/:id/delete', items.delete);

module.exports = router;