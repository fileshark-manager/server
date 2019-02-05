const express = require('express');
const router = express.Router();
const folderController = require('../controllers/folderController');
// const storeController = require('../controllers/storeController');
// const userController = require('../controllers/userController');
// const authController = require('../controllers/authController');
// const reviewController = require('../controllers/reviewController');
const {catchErrors} = require('../handlers/errorHandlers');

/* API */
router.get('/api/folder', catchErrors(folderController.getAll));
router.get('/api/folder/:id', catchErrors(folderController.get));
router.post('/api/folder', catchErrors(folderController.create));
// router.put('/api/folder/:id', updateFolderController);
// router.delete('/api/folder/:id', deleteFolderController);



// router.get('/api/search', catchErrors(storeController.searchStores));
// router.get('/api/stores/near', catchErrors(storeController.mapStores));
// router.post('/api/stores/:id/heart', catchErrors(storeController.heartStore));

module.exports = router;
