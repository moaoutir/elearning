var mysql = require('mysql');


var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  port : 3306,
  database : 'e_learning'
});

module.exports=()=>{
  return (req,rep,next)=>{
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
