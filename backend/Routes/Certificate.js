const express = require('express');
var mysql = require('mysql');
//var open = require('opn');
//var FileController = require('../controller/FileController');
const ValidateJWB = require('../middelware/check_authenticate');


const router = express.Router();

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  port : 3306,
  database : 'e_learning'
});

const createCertificate = require("./Create_Certificate");

router.post('/',ValidateJWB('student'),(req,rep,next)=>{
  // on selectionne le nom de l'apprenant et son formateur
  con.query('SELECT * FROM login WHERE _login = ? OR _login = ?',[req.userData.login,req.body.creator],(erreur,resultat)=>{
    if (erreur) {
      console.log(erreur);
    }
        // createCertificate( etudiant, formateur)
    let name_certificate
    if (resultat[0]._role === "student") {
      name_certificate = createCertificate.createCertificate(resultat[0]._firstName,resultat[0]._lastName,resultat[1]._firstName,resultat[1]._lastName,req.body.name_course);
    }else{
      name_certificate = createCertificate.createCertificate(resultat[1]._firstName,resultat[1]._lastName,resultat[0]._firstName,resultat[0]._lastName,req.body.name_course);
    }
    const url = req.protocol + "://" + req.get("host")+"/images/"+name_certificate;

    con.query('INSERT INTO certificate(_certificate,_learner,_nameCourse,_score,id_course) VALUES(?,?,?,?,?)',[url,req.userData.login,req.body.name_course,req.body.score,req.body.id_course],(erreur,resultat)=>{
      if (erreur) {
        console.log(erreur);
    }
    rep.json({certificate: url});
  });
  })

})



router.get('/',ValidateJWB('student'),(req,rep,next)=>{

  con.query("SELECT * FROM certificate WHERE _learner = ?",[req.userData.login],(erreur,resultat)=>{
    if (erreur) {
      console.log(erreur);
    }
      rep.json({certificates: resultat})
  })
})



router.get('/tous_les_certificats',ValidateJWB('former administrator'),(req,rep,next)=>{

  con.query("SELECT * FROM certificate",[],(erreur,resultat)=>{
    if (erreur) {
      console.log(erreur);
    }
      rep.json({certificates: resultat})
  })
})

module.exports = router;
