//rutas para autenticar usuarios
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController')
const auth = require("../middleware/auth");

//iniciar sesion
//api/auth
router.post('/', 
    authController.authUser
)
//obtiene usuario
router.get('/',
    auth,
    authController.currentAuthUser
)
module.exports = router;