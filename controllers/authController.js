const User = require("../models/User");
const bcryptjs = require("bcryptjs");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

exports.authUser = async (req, res) => {
  //revisar errores
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log("error", req.body);
    return res.status(400).json({ errores: errors.array() });
  }
  //destructuring user
  const { email, password } = req.body;

  try {
    //revisar que esté registrado
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "User doesn´t exist" });
    }
    //revisar pass
    const correctPass = await bcryptjs.compare(password, user.password);
    if (!correctPass) {
      return res.status(400).json({ msg: "Incorrect Password" });
    }
    //si todo es correcto
    //crear y firmar jwt
    const payload = {
        user: {
            id: user.id
        }
    }
    //firmar token
    jwt.sign(
      payload,
      process.env.SECRET,
      {
        expiresIn: 3600000
      },
      (error, token) => {
        if (error) throw error;
        //confirm
        res.json({ token });
      }
    );
  } catch (error) {
    console.log(error);
  }
};

//obtiene que usuario está autenticado
exports.currentAuthUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password')
    res.json({user})
  } catch (error) {
    console.log(error)
    res.status(500).json({msg: 'hubo un error'})
  }
}
