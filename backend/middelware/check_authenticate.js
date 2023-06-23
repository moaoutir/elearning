const jwt = require('jsonwebtoken');

module.exports = (permission)=>{
  return (req,rep,next)=>{
    try{
      const token = req.headers.authorization;

      const tokenDecoded = jwt.verify(token,"secret_password_123");
      if (tokenDecoded) {
        req.userData = tokenDecoded;

        if (permission.includes(tokenDecoded.role)) {
          console.log("permission: ",permission);
          next();
        }else{
          rep.status(401).json({message : "unauthorized"});
        }
      }
  }catch(error){
      rep.status(401).json({message : "unauthorized"});
    }
}
}

// Une middleware est une fonction intermédiaire qui s'exécute entre la réception de la requête et l'envoi de la réponse dans une application web
