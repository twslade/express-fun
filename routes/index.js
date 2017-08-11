const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

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

router.get('/tags', catchErrors(storeController.getStoresByTag));
router.get('/tags/:tag', catchErrors(storeController.getStoresByTag));

router.get('/login', userController.loginForm);
router.get('/register', userController.registerForm);

// 1.) Validate Data
// 2.) Add user to db
// 3.) Log them in
router.post('/register',
    userController.validateRegister,
    userController.register,
    authController.login,
);

router.get('/logout', authController.logout);

module.exports = router;
