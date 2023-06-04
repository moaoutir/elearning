const express = require('express');
var mysql = require('mysql');
// npm install --save jsonwebtoken
const jwt = require('jsonwebtoken');
const ValidateJWB = require('../middelware/check_authenticate')


const router = express.Router();

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  port : 3306,
  database : 'e_learning'
});

router.post('/sign_up',(req,rep,next)=>{
    con.query('INSERT INTO login(_lastName,_firstName,_login,_email,_password,_role) VALUES (?,?,?,?,?,?)',[req.body._firstName,req.body._lastName,req.body._login,req.body._email,req.body._password,req.body._type],(erreur,resultat)=>{
      if (erreur) {
        console.log(erreur);
        rep.json({message: "failed"})
      }
    })
})

router.post('/sign_in',(req,rep,next)=>{
  con.query('SELECT * FROM login WHERE _login = ? and _password	= ?',[req.body._login,req.body._password],(erreur,resultat)=>{
    if (erreur) {
      console.log(erreur);
    }else{
        if (resultat.length>0) {
          const secret_key = 'secret_password_123';
        const token = jwt.sign({login: resultat[0]._login,email: resultat[0]._email,role: resultat[0]._role},secret_key)//{expiresIn:"1h"}
        rep.json({token:token,ExpiresIn : 3600,role:resultat[0]._role})
      } else rep.status(401).json({message:"failed"})
    }
  })
})

router.get('/listes_formateurs',ValidateJWB('administrator'),(req,rep,next)=>{
  con.query("SELECT _login,_email,_firstName,_lastName FROM login WHERE _role = 'former'",[],(erreur,resultat)=>{
    if (erreur) {
      console.log(erreur);
    }else{
      rep.json({users: resultat})
    }
  })
})

router.get('/get_email/:user',ValidateJWB('student administrator former '),(req,rep,next)=>{

  con.query("SELECT _email FROM login WHERE _login = ?",[req.params.user],(erreur,resultat)=>{
    if (erreur) {
      console.log(erreur);
    }
    if (resultat.length>0) {
      rep.status(200).json({email:resultat[0]._email});
    }else
    rep.status(404).json({message : "not found"})
  })
})

router.delete('/:login',ValidateJWB('administrator'),(req,rep,next)=>{
  console.log(req.params);
  con.query("SELECT _role FROM login WHERE _login = ?",[req.params.login],(erreur,resultat)=>{
    if (erreur) {
      console.log(erreur);
    }
    // ici on gere deux cas le premier si user est un formateur donc on doit supprimer
    // le domaine et les dmodules affectes a user dans les tables my_domain,my_module
    con.query('DELETE FROM login WHERE _login = ?',[req.params.login],(erreur,resultat2)=>{
      if (erreur) {
        console.log(erreur);
      }
      if (resultat[0]._role === 'former') {
        con.query('DELETE my_domain,my_module FROM my_domain INNER JOIN my_module ON my_domain._id = my_module.id_my_domain WHERE my_domain.user = ?',[req.params.login],(erreur,resultat)=>{
          if (erreur) {
            console.log(erreur);
          }
        })
      }else{ // si le user et un apprenant donc on doit supprimer les cours qui l'ont acheter de la table my_course
        con.query('DELETE FROM my_course WHERE user = ?',[req.params.login],(erreur,resultat)=>{
          if (erreur) {
            console.log(erreur);
          }
          con.query('DELETE FROM certificate WHERE _learner = ?',[req.params.login],(erreur,resultat)=>{
            if (erreur) {
              console.log(erreur);
            }
          })
        })
      }
    })

    rep.status(202).json({message :"successfully deleted"});
  })
})

module.exports = router;
