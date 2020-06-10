//rutas para crear usuarios
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController')
const { check } = require('express-validator')

//crear usuario
router.post('/', 
[
    check("name", "You must add a name").not().isEmpty(),
    check('email', 'You must add a valid email').isEmail(),
    check('password', 'Minimum six characters').isLength({min: 6})
],
    userController.createUser
)

module.exports = router;