const express = require('express');
const router = express.Router();
const folderController = require('../controllers/folderController');
const {catchErrors} = require('../handlers/errorHandlers');

/* API */
router.get('/api/folder', catchErrors(folderController.getAll));
router.get('/api/folder/:id', catchErrors(folderController.get));
router.post('/api/folder', catchErrors(folderController.create));
// router.put('/api/folder/:id', updateFolderController);
// router.delete('/api/folder/:id', deleteFolderController);

module.exports = router;
