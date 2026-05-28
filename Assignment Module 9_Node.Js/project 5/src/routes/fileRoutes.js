const express = require('express');
const router = express.Router();

const upload = require('../middleware/uploadMiddleware');
const fileController = require('../controllers/fileController');
const { ensureAuth } = require('../middleware/authMiddleware');

router.use(ensureAuth);

// upload file
router.post('/upload', upload.single('file'), fileController.uploadFile);

// file details
router.get('/:id', fileController.getFile);

// download file
router.get('/download/:id', fileController.downloadFile);

module.exports = router;