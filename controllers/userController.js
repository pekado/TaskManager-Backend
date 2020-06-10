const User = require("../models/User");
const bcryptjs = require("bcryptjs");
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken')
exports.createUser = async (req, res) => {
    //revisar errores
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errores: errors.array()})
    }

  //destructuring
  const { email, password } = req.body;

  try {
    //validar usuario unico
    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ msg: "El usuario ya existe" });
    }
    //crea usuario
    user = new User(req.body);
    //hashear pass
    const salt = await bcryptjs.genSalt(10);
    user.password = await bcryptjs.hash(password, salt);
    //guardar usuario
    await user.save();
    //crear y firmar jwt
    const payload = {
        user: {
            id: user.id
        }
    }
    //firmar token
    jwt.sign(payload, process.env.SECRET, {
        expiresIn: 3600000
    }, (error, token) => {
        if(error) throw error;
         //confirm
    res.json({ token});
    })
   
  } catch (error) {
    console.log(error);
    res.status(400).send("hubo un error");
  }
};
