const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const { catchErrors } = require('../handlers/errorHandlers');

router.get('/', storeController.homePage);
router.get('/stores', catchErrors(storeController.getStores));
router.get('/add',
    authController.isLoggedIn,
    storeController.add);
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
router.post('/login', authController.login);

router.get('/register', userController.registerForm);
router.post('/register',
    // 1.) Validate Data
    userController.validateRegister,
    // 2.) Add user to db
    userController.register,
    // 3.) Log them in
    authController.login,
);

router.get('/logout', authController.logout);

router.get('/account')

module.exports = router;
