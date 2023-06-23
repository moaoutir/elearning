const express = require('express');
const multer = require('multer');
// npm install mysql
var mysql = require('mysql');
// npm install fs
var fs = require('fs');
//const { error } = require('console');
const ValidateJWB = require('../middelware/check_authenticate');

 // Multer est une bibliothèque Node.js pratique pour gérer les téléchargements de fichiers dans les applications web
const filetypes = /jpeg|jpg|png|pdf|mp4/;
const storage = multer.diskStorage({
  destination: (req,file,cb)=>{
    const isvalid = filetypes.test(file.mimetype);
    // la route c'est du fichier server.js
    if (isvalid) {
      cb(null,"backend/images")
    }else
      return;

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
  const url1 = req.protocol + "://" + req.get("host")+"/images/"+ req.files.course[0]?.filename;
  const url2 = req.protocol + "://" + req.get("host")+"/images/"+ req.files.tp[0]?.filename;
  const url3 = req.protocol + "://" + req.get("host")+"/images/"+ req.files.image[0]?.filename;
  console.log(url1,"  ",url2," ",url3);
  con.query("INSERT INTO courses(_titleCours,_description,_price,_domain,_module,_course,_tp,_image,_creator) VALUES (?,?,?,?,?,?,?,?,?)",[req.body.titleCours,req.body.description,parseInt(req.body.price),req.body.domain,req.body.filiere,url1,url2,url3,req.userData.login],(erreur,resultat1)=>{
    if (erreur) {
      console.log(erreur);
    }else{
      con.query("SELECT _id FROM courses WHERE _titleCours =? AND _description = ? AND _price = ? AND _domain = ? AND _module =? AND _course = ?",[req.body.titleCours,req.body.description,parseInt(req.body.price),req.body.domain,req.body.filiere,url1],(erreur,resultat2)=>{
        if (erreur) {
          console.log(erreur);
        }
        rep.json({id : resultat2[0]._id})
      })
    }
  })
})


router.get('/My_students_and_their_courses',ValidateJWB("former"),(req,rep,next)=>{
   // Nous recherchons les cours que nos étudiants ont achetés de la table my courses
    con.query("SELECT _titleCours,_price,_domain,_module,user FROM my_course INNER JOIN courses ON courses._id = my_course.id_course WHERE courses._creator = ?",[req.userData.login],(erreur,resultat)=>{
      if (erreur) {
        console.log(erreur);
      }
      rep.json({mes_cours: resultat})
    })
})


router.get('/all_courses_and_their_students',ValidateJWB('administrator'),(req,rep,next)=>{
  // l'administrateur peut chercher l'ensemble des etudints et leur cours
  con.query("SELECT _titleCours,_price,_domain,_module,user FROM my_course INNER JOIN courses ON courses._id = my_course.id_course",[],(erreur,resultat)=>{
    if (erreur) {
      console.log(erreur);
    }
    rep.json({mes_cours: resultat})
  })
})


router.get('/MyLearning',ValidateJWB('student'),(req,rep,next)=>{  // l'etudiant peut chercher les cours dont il est inscrit
      con.query("SELECT * FROM my_course INNER JOIN courses ON courses._id = my_course.id_course WHERE my_course.user = ?",[req.userData.login],(erreur,resultat)=>{
        if (erreur) {
          console.log(erreur);
        }
        rep.json({my_learning: resultat})
      })
})

router.post('/MyCourses',ValidateJWB('student'),(req,rep,next)=>{ // inserer dans my_courses le cours dont l'etudiant est inscrit
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

router.get('/MycourseCreate',ValidateJWB('former'),(req,rep,next)=>{ // envoyer les cours que le formateur a cree
  con.query("SELECT * FROM courses WHERE _creator = ?",[req.userData.login],(erreur,resultat)=>{
    if (erreur) {
      console.log(erreur);
    }else{
      rep.json({courses:resultat})
    }
  })
})


router.get('/count',(req,rep,next)=>{
  con.query("SELECT count(*) AS count FROM courses",(erreur,resultat1)=>{
    if (erreur) {
      console.log(erreur);
    }
    con.query("SELECT count(*) AS count FROM login WHERE _role = 'former'",[],(erreur,resultat2)=>{
      if (erreur) {
        console.log(erreur);
      }
      con.query("SELECT count(*) AS count FROM login WHERE _role = 'student'",[],(erreur,resultat3)=>{
        if (erreur) {
          console.log(erreur);
        }
        rep.json({cours:resultat1,formers:resultat2,students:resultat3})
      })
    })
  })
})


function cherher_cours_par_id(id,rep) {
  con.query("SELECT * FROM courses WHERE _id = ?",[id],(erreur,resultat1)=>{
    if (erreur) {
      console.log(erreur);
    }
        con.query("SELECT _firstName, _lastName FROM login WHERE _login = ?",[resultat1[0]._creator],(erreur,resultat2)=>{
          if (erreur) {
            console.log(erreur);

          }
            rep.json({course:resultat1[0],instructor:resultat2[0]})
        })
  })
}



router.get('/:id',ValidateJWB('former student'),(req,rep,next)=>{
  if (req.userData.role === "student") { // on cherche si l'apprenant a le droit de consulter un cours
    con.query("SELECT id_course FROM my_course WHERE user = ? and id_course = ?",[req.userData.login,req.params.id],(erreur,resultat)=>{
      if (erreur) {
        console.log(erreur);
      }
      // si on trouve que l'id de cours existe chez l'etudiant donc on cherche le cours complet
      if (resultat.length > 0) {
        cherher_cours_par_id(req.params.id,rep);
      }else
        rep.status(404).json({message: "unauthorized"})

    })
  }else if(req.userData.role === "former"){
    con.query("SELECT _id FROM courses WHERE _creator = ? and _id = ?",[req.userData.login,req.params.id],(erreur,resultat)=>{
      if (erreur) {
        console.log(erreur);
      }
        if (resultat.length > 0) {
          cherher_cours_par_id(req.params.id,rep);
        }else
          rep.status(404).json({message: "unauthorized"})
      })
  }
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


module.exports = router;
