var mysql = require('mysql');


var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  port : 3306,
  database : 'e_learning'
});

const middleware = {
  requireAuthentication(permission) {
    return (req,rep,next) =>{
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
},
  requireAuthorization: function(req, rep, next) {
    if (req.userData.role ==="student") {
      console.log("student");
      con.query("SELECT id_course FROM my_course WHERE user = ?",[req.userData.login],(erreur,resultat)=>{
        if (erreur) {
          console.log(erreur);
        }
        if (resultat.includes(req.params.id)) {
          console.log("kkkk",req.userData.login);
          next();
        }
      })
    }else{
      console.log("former");
      con.query("SELECT _id FROM courses WHERE _creator = ?",[req.userData.login],(erreur,resultat)=>{
        if (erreur) {
          console.log(erreur);
        }
        console.log(resultat);
        for (let i = 0; i < resultat.length; i++) {
          if (resultat[i]._id == req.params.id) {
            console.log("kkkk",req.userData.login);
            next();
          }
        }
      })
    }

    rep.status(401).json({message : "unauthorized"})

  }
}

module.exports = middleware;
