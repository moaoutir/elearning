const express = require('express');
var mysql = require('mysql');
var open = require('opn');
var FileController = require('../controller/FileController');
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
  console.log(req.body);
  con.query('SELECT * FROM login WHERE _login = ? OR _login = ?',[req.userData.login,req.body.creator],(erreur,resultat)=>{
    if (erreur) {
      console.log(erreur);
    }
    console.log(resultat);
    let first_name_former,last_name_former,first_name_student,last_name_student,i = 1,j = 0;//les etudiants sont les premiers puis les etudiants
    if (resultat[0]._role === "former") {
      i = 0;
      j = 1;
    }
  const name_certificate = createCertificate.createCertificate(resultat[j]._firstName,resultat[j]._lastName,resultat[i]._firstName,resultat[i]._lastName,req.body.name_course);
  const url = req.protocol + "://" + req.get("host")+"/images/"+name_certificate;
  console.log(url,"  ",req.body.score);

  con.query('INSERT INTO certificate(_certificate,_learner,_nameCourse,_score,id_course) VALUES(?,?,?,?,?)',[url,req.userData.login,req.body.name_course,req.body.score,req.body.id_course],(erreur,resultat)=>{
    if (erreur) {
      console.log(erreur);
    }
    rep.json({certificate: url});
  });
  })

})

router.get('/',ValidateJWB('student former administrator'),(req,rep,next)=>{

  con.query("SELECT * FROM certificate WHERE _learner = ?",[req.userData.login],(erreur,resultat)=>{
    if (erreur) {
      console.log(erreur);
    }
      rep.json({certificates: resultat})
  })
})

router.get('/tous_les_certificats',ValidateJWB('student former administrator'),(req,rep,next)=>{

  con.query("SELECT * FROM certificate",[],(erreur,resultat)=>{
    if (erreur) {
      console.log(erreur);
    }
      rep.json({certificates: resultat})
  })
})

module.exports = router;