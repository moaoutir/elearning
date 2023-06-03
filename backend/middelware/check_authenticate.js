const jwt = require('jsonwebtoken');
const AuthPage = require('../middelware/check_authorisation');

module.exports = (permission)=>{
  return (req,rep,next)=>{
    try{
      // on decoupe le token car ce dernier est compose (bearer xxxxxxxxx) est nous avons besoin de la derniere partie du token
      //console.log("token verify ",req.headers.authorization);
      const token = (req.headers.authorization).split(' ')[1];
      //console.log("token split ",token);
      const tokenDecoded = jwt.verify(token,"secret_password_123");
      if (tokenDecoded) {
        req.userData = tokenDecoded;

        if (permission.includes(req.userData.role)) {
          console.log("prmission",permission);
          next();
        }
      }
  }catch(error){
      rep.status(401).json({message : "unauthorized1"});
      //console.log("unauthorized1");
    }
}
}

