const express = require('express');
const router = express.Router();
const folderController = require('../controllers/folderController');
const fileController = require('../controllers/fileController');
const {catchErrors} = require('../handlers/errorHandlers');

/* API */
router.get('/api/folder', catchErrors(folderController.getAll));
router.get('/api/folder/:id', catchErrors(folderController.get));
router.post('/api/folder', catchErrors(folderController.create));
router.put('/api/folder/:id', catchErrors(folderController.update));
router.delete('/api/folder/:id', catchErrors(folderController.delete));

router.get('/api/file', catchErrors(fileController.getAll)); // учесть offset, limit, folder в GET параметрах для пагинации
router.get('/api/file/:id', catchErrors(fileController.get));
router.post('/api/file', catchErrors(fileController.create));
router.put('/api/file/:id', catchErrors(fileController.update));
// router.delete('/:id', deleteFileController);

module.exports = router;
