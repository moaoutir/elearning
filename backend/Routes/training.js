const express = require('express');
var mysql = require('mysql');
const ValidateJWB = require("../middelware/check_authenticate");

const router = express.Router();

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  port : 3306,
  database : 'e_learning'
});

router.get('/module/:id_module',ValidateJWB('administrator former'),(req,rep,next)=>{
  con.query("SELECT * FROM module WHERE id_domain = ?",[req.params.id_module],(erreur,resultat)=>{
    if (erreur) {
      console.log(erreur);
    }else
    rep.json({list_module: resultat})
  })
})

router.get('/domain',ValidateJWB('administrator former'),(req,rep,next)=>{
  con.query("SELECT * FROM domain",(erreur,resultat)=>{
    if (erreur) {
      console.log(erreur);
    }
    rep.json({list_domain: resultat})
  })
})

router.get('/my_module',ValidateJWB('administrator former'),(req,rep,next)=>{
  con.query("SELECT name_domain,_id,id_domain,user FROM my_domain,domain WHERE domain.id = my_domain.id_domain and my_domain.user = ?",[req.userData.login],(erreur,resultat_domain)=>{
    if (erreur) {
      console.log(erreur);
    }
    if(resultat_domain.length > 0){
      con.query("SELECT name_module,module._id,id_domain FROM module,my_module WHERE module._id = my_module.id_module AND id_my_domain = ?",[resultat_domain[0]._id],(erreur,resultat_module)=>{
        if (erreur) {
          console.log(erreur);
        }
        rep.json({my_domain:resultat_domain[0],my_modules:resultat_module});
      })
    }
  })
})

router.get('/listMy_module',ValidateJWB('administrator former'),(req,rep,next)=>{
  con.query("SELECT name_domain,_id,id_domain,user FROM my_domain,domain WHERE domain.id = my_domain.id_domain",[],(erreur,resultat_domain)=>{
    if (erreur) {
      console.log(erreur);
    }//on selectione le nom du module avec module._id = my_module.id_module et le user avec my_module.id_my_domain = my_domain._id
    con.query("SELECT name_module,user,module.id_domain FROM module,my_module,my_domain WHERE module._id = my_module.id_module and my_module.id_my_domain = my_domain._id",[],(erreur,resultat_module)=>{
      if (erreur) {
        console.log(erreur);
      }
      rep.json({list_my_domain:resultat_domain,list_my_modules:resultat_module})
    })
  })
})

router.get('/domain/:id_domain',ValidateJWB('administrator'),(req,rep,next)=>{
  con.query("SELECT * FROM domain WHERE id = ?",[req.params.id_domain],(erreur,resultat1)=>{
    if (erreur) {
      console.log(erreur);
    }else{
      con.query("SELECT * FROM module WHERE id_domain = ?",[req.params.id_domain],(erreur,resultat2)=>{
        if (erreur)
          console.log(erreur);
        else rep.json({list_domain: resultat1[0],list_module:resultat2})
      })
    }
  })
})

router.post('/domain',ValidateJWB('administrator'),(req,rep,next)=>{
  con.query("INSERT INTO domain(name_domain) VALUES (?)",[req.body.name_domain],(erreur,resultat)=>{
    if (erreur)
      console.log(erreur);
  })
})

router.post('/module',ValidateJWB('administrator'),(req,rep,next)=>{
  con.query("DELETE FROM module WHERE id_domain = ?",[req.body[0].id_domain],(erreur,resultat)=>{
    if (erreur) {
      console.log(erreur);
    }else{
      if (req.body[0].name_module!==null) {
        for (let i = 0; i < req.body.length; i++) {
          console.log(req.body[i].id_domain);
          con.query("INSERT INTO module(name_module,id_domain) VALUES(?,?)",[req.body[i].name_module,req.body[i].id_domain],(erreur,resultat)=>{
            if (erreur)
              console.log(erreur);
          })
        }
      }
}})
})

router.post('/my_module',ValidateJWB('administrator'),(req,rep,next)=>{
  con.query("INSERT INTO my_domain(user,id_domain) VALUES(?,?)",[req.body.user,req.body.id_domain],(erreur,resultat)=>{
    if (erreur)
      console.log(erreur);
    con.query("SELECT _id FROM my_domain WHERE user = ? and id_domain = ?",[req.body.user,req.body.id_domain],(erreur,resultat)=>{
      if (erreur) {
        console.log(erreur);
      }
      for(let i =0;i<req.body.list_id_module.length;i++){
        con.query("INSERT INTO my_module(id_module,id_my_domain) VALUES(?,?)",[req.body.list_id_module[i],resultat[0]._id],(erreur,resultat)=>{})
        if (erreur) {
          console.log(erreur);
        }
      }
    })
  })
})

router.delete('/domain/:name',ValidateJWB('administrator'),(req,rep,next)=>{
 con.query("SELECT * FROM domain WHERE name_domain = ?",[req.params.name],(erreur,domain)=>{
  if (erreur) {
    console.log(erreur);
  }
  if (domain.length>0) {
    con.query("DELETE FROM domain WHERE name_domain = ?",[req.params.name],(erreur,resultat)=>{
      if (erreur)
        console.log(erreur);
      else{
        con.query("DELETE FROM module WHERE id_domain = ?",[domain[0].id],(erreur,resultat)=>{
          if (erreur) {
            console.log(erreur);
          }
          rep.json({message:"supprimer"})
        })
      }
    });
  }

 })
})

module.exports = router;
