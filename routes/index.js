const express = require('express');
const router = express.Router();
const folderController = require('../controllers/folderController');
const fileController = require('../controllers/fileController');
const {catchErrors} = require('../handlers/errorHandlers');

/* API FOR FOLDERS */
router.get('/api/folder', catchErrors(folderController.getAll));
router.get('/api/folder/:id', catchErrors(folderController.get));
router.post('/api/folder', catchErrors(folderController.create));
router.put('/api/folder/:id', catchErrors(folderController.update));
router.delete('/api/folder/:id', catchErrors(folderController.delete));

/* API FOR FILES */
router.get('/api/file', catchErrors(fileController.getAll));
router.get('/api/file/:id', catchErrors(fileController.get));
router.post('/api/file',
    fileController.upload,
    catchErrors(fileController.resize),
    catchErrors(fileController.create)
);
router.put('/api/file/:id', catchErrors(fileController.update));
router.delete('/api/file/:id', catchErrors(fileController.delete));

/* API FOR DEMO PURPOSE ONLY (RESETS AND CREATES SAMPLE DATA) */
router.get('/api/bigbang',
    catchErrors(folderController.bang),
    catchErrors(fileController.bang),

    catchErrors(folderController.loadSample),
    catchErrors(fileController.loadSample)
);

module.exports = router;
