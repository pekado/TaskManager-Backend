const jwt = require('jsonwebtoken')

module.exports = function(req, res, next) {
     //leer el token del header
     const token = req.header('x-auth-token');
     //revisar si no hay tokem
     if(!token){
         return res.status(401).json({msg: 'no token, permission denied'})
     }
     //validar toke
     try {
         const decode = jwt.verify(token, process.env.SECRET)
         req.user = decode.user;
         next()
     } catch (error) {
         res.status(401).json({ msg: 'invalid token'})
     }

}