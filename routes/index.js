const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController');


const { catchErrors } = require('../handlers/errorHandlers');

router.get('/', storeController.homePage);
router.get('/stores', catchErrors(storeController.getStores));
router.get('/add', storeController.add);
router.post('/add',
    storeController.upload,
    catchErrors(storeController.resize),
    catchErrors(storeController.createStore)
);

router.post('/add/:id',
    storeController.upload,
    catchErrors(storeController.resize),
    catchErrors(storeController.updateStore)
);

router.get('/store/:slug/', catchErrors(storeController.viewStore));
router.get('/store/:id/edit/', catchErrors(storeController.editStore));

router.get('/tags', catchErrors(storeController.getStoresByTag))
router.get('/tags/:tag', catchErrors(storeController.getStoresByTag))

module.exports = router;
