const express = require('express');
const router = express.Router();

const folderController = require('../controllers/folderController');
const { ensureAuth } = require('../middleware/authMiddleware');

router.use(ensureAuth);

router.get('/', folderController.getFolders);
router.get('/:id', folderController.getFolder);
router.post('/', folderController.createFolder);
router.put('/:id', folderController.updateFolder);
router.delete('/:id', folderController.deleteFolder);


module.exports = router;