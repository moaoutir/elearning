const express = require('express');
const multer = require('multer');
// npm install mysql
var mysql = require('mysql');
// npm install fs
var fs = require('fs');
const { error } = require('console');
const ValidateJWB = require('../middelware/check_authenticate');
const authorization = require('../middelware/check_pemision_course');

const MIME_TYPE_MAP = {
  'image/png' : 'png',
  'image/jpeg' : 'jpg',
  'image/jpg' : 'jpg'
}
const filetypes = /jpeg|jpg|png|pdf|mp4/; // filetypes you will accept
    //const mimetype = filetypes.test(file.mimetype);

const storage = multer.diskStorage({
  destination: (req,file,cb)=>{
    //const isvalid = MIME_TYPE_MAP[file.mimetype];
    const isvalid = filetypes.test(file.mimetype);
    //console.log(isvalid);
    const erreur = "Invalid mine type";
    if (isvalid) {
      //erreur = null;
    }
    // la route c'est du fichier server.js
    cb(null,"backend/images")
  },
  filename:(req,file,cb)=>{
    const name = file.originalname.toLocaleLowerCase().split(' ').join('_');
    const ext = filetypes.test(file.mimetype);
    cb(null,  '-' + Date.now() + '.' + name);
  }
});
const router = express.Router();

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  port : 3306,
  database : 'e_learning'
});


router.post('/',ValidateJWB('former'),multer({storage : storage}).fields([{ name:'course'}, { name:'tp'},{ name:'image'}]),(req,rep,next)=>{
  console.log("dldlld");
  const url1 = req.protocol + "://" + req.get("host")+"/images/"+ req.files.course[0]?.filename;
  const url2 = req.protocol + "://" + req.get("host")+"/images/"+ req.files.tp[0]?.filename;
  const url3 = req.protocol + "://" + req.get("host")+"/images/"+ req.files.image[0]?.filename;
  console.log(url1,"  ",url2," ",url3);
  con.query("INSERT INTO courses(_titleCours,_description,_price,_domain,_module,_course,_tp,_image,_creator) VALUES (?,?,?,?,?,?,?,?,?)",[req.body.titleCours,req.body.description,parseInt(req.body.price),req.body.domain,req.body.module,url1,url2,url3,req.userData.login],(erreur,resultat1)=>{
    if (erreur) {
      console.log(erreur);
    }else{
      con.query("SELECT _id FROM courses WHERE _titleCours =? AND _description = ? AND _price = ? AND _domain = ? AND _module =? AND _course = ?",[req.body.titleCours,req.body.description,parseInt(req.body.price),req.body.domain,req.body.module,url1],(erreur,resultat2)=>{
        if (erreur) {
          console.log(erreur);
        }
        rep.json({id : resultat2[0]._id})
      })
    }
  })
})


//apres avoir ajoute l'authentification on doit chercher les id des cours selon instructeur puis chercher
// dans la table mycourses les id des coures
router.get('/MyCourses/:user',ValidateJWB("administrator former"),(req,rep,next)=>{
  if (req.params.user == "null") { // Nous recherchons des cours que nos étudiants ont achetés de la table my courses
    con.query("SELECT _titleCours,_price,_domain,_module,_login FROM my_course INNER JOIN login ON my_course.user = login._login INNER JOIN courses ON courses._id = my_course.id_course WHERE courses._creator = ?",[req.userData.login],(erreur,resultat)=>{
      if (erreur) {
        console.log(erreur);
      }
      rep.json({mes_cours: resultat})
    })
  }else{
    console.log(req.params.user);
    con.query("SELECT * FROM courses WHERE _creator = ?",[req.params.user],(erreur,resultat)=>{
      if (erreur) {
        console.log(erreur);
      }
      rep.json({mes_cours: resultat})
    })
  }
})

router.get('/all_courses_and_their_students',ValidateJWB('administrator'),(req,rep,next)=>{
      con.query("SELECT _titleCours,_price,_domain,_module,_login FROM my_course INNER JOIN login ON my_course.user = login._login INNER JOIN courses ON courses._id = my_course.id_course",[],(erreur,resultat)=>{
        if (erreur) {
          console.log(erreur);
        }
        rep.json({mes_cours: resultat})
      })
})

//apres avoir ajoute l'authentification on doit ajoute where user = nom de user

router.get('/MyLearning',ValidateJWB('student'),(req,rep,next)=>{
  console.log("req.userData");
      con.query("SELECT * FROM my_course INNER JOIN courses ON courses._id = my_course.id_course WHERE my_course.user = ?",[req.userData.login],(erreur,resultat)=>{
        if (erreur) {
          console.log(erreur);
        }
        rep.json({my_learning: resultat})
      })
})

router.post('/MyCourses',ValidateJWB('student'),(req,rep,next)=>{
  con.query("INSERT INTO my_course(id_course,user) VALUES (?,?)",[req.body.id_courses,req.userData.login],(erreur,resultat)=>{
    if (erreur) {
      console.log(erreur);
    }
  })
})

router.get('/',(req,rep,next)=>{
  con.query("SELECT * FROM courses",[],(erreur,resultat)=>{
    if (erreur) {
      console.log(erreur);
    }else{
        rep.json({courses:resultat})
    }
  })
})

router.get('/MycourseCreate',ValidateJWB('former'),(req,rep,next)=>{
  console.log(req.userData);
  con.query("SELECT * FROM courses WHERE _creator = ?",[req.userData.login],(erreur,resultat)=>{
    if (erreur) {
      console.log(erreur);
    }else{
      rep.json({courses:resultat})
    }
  })
})
// a verifier s'il faut ajouter le ValidateJWB


router.get('/count',(req,rep,next)=>{
  con.query("SELECT count(*) AS count FROM courses",(erreur,resultat1)=>{
    if (erreur) {
      console.log(erreur);
    }
    con.query("SELECT count(*) AS count FROM login WHERE _role = ?",["former"],(erreur,resultat2)=>{
      if (erreur) {
        console.log(erreur);
      }
      con.query("SELECT count(*) AS count FROM login WHERE _role = 'student'",(erreur,resultat3)=>{
        if (erreur) {
          console.log(erreur);
        }
        rep.json({cours:resultat1,formers:resultat2,students:resultat3})
      })
    })
  })
})


function type_of_user(id,rep) {
  con.query("SELECT * FROM courses WHERE _id = ?",[id],(erreur,resultat1)=>{
    if (erreur) {
      console.log(erreur);
    }
      if (resultat1.length > 0) {
        con.query("SELECT _firstName, _lastName FROM login WHERE _login = ?",[resultat1[0]._creator],(erreur,resultat2)=>{
          if (erreur) {
            console.log(erreur);

          }
            rep.json({course:resultat1[0],instructor:resultat2[0]})
        })
      }else
        rep.status(401).json({message:"failed"})
  })
}

router.get('/:id',ValidateJWB('former student'),(req,rep,next)=>{

  if (req.userData.role === "student") {
    con.query("SELECT id_course FROM my_course WHERE user = ?",[req.userData.login],(erreur,resultat)=>{
      if (erreur) {
        console.log(erreur);
      }
      for (let i = 0; i < resultat.length; i++) {
        if (resultat[i].id_course == req.params.id) {
          type_of_user(req.params.id,rep);
          break;
        }
      }
    })
  }else if(req.userData.role === "former"){
    let  i;
    con.query("SELECT _id FROM courses WHERE _creator = ?",[req.userData.login],(erreur,resultat)=>{
      if (erreur) {
        console.log(erreur);
      }
      console.log(resultat);
      for (i = 0; i < resultat.length; i++) {
        if (resultat[i]._id == req.params.id) {
          type_of_user(req.params.id,rep);
          break;
        }
      }if(i == resultat.length)
      rep.status(404).json({message: "unauthorized"})
    })

  }else
     rep.status(404).json({message: "unauthorized"})

})




router.get('/search/:name',(req,rep,next)=>{
  var keyword = ("%"+req.params.name+"%")
  con.query("SELECT * FROM courses WHERE _titleCours LIKE ? ",[keyword],(erreur,resultat)=>{
    if(erreur){
      console.log(erreur);
    }
    rep.json({liste_cours: resultat})
  })
})



router.delete('/:id',ValidateJWB("former administrator"),(req,rep,next)=>{
  console.log(req.params.id," delete");
  con.query("DELETE FROM courses  WHERE _id= ?",[req.params.id],(erreur,resultat)=>{
    if (erreur) {
      console.log(erreur);
    }
    con.query("DELETE question_response,options FROM question_response INNER JOIN options ON question_response.id_question = options.id_question WHERE question_response.id_course = ?",[req.params.id],(erreur,resultat)=>{
      if (erreur) {
        console.log(erreur);
      }
    })
  })
  con.query("DELETE FROM my_course WHERE id_course = ?",[req.params.id],(erreur,resultat)=>{
    if (erreur) {
      console.log(erreur);
    }
    rep.json({data: "course is deleted"});
  })
})
//



router.get((req,rep,next)=>{
  rep.send("connecte ...")
  console.log("connecte ...");
})

module.exports = router;
