const express = require('express');
var mysql = require('mysql');
const ValidateJWB = require('../middelware/check_authenticate')


const router = express.Router();

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  port : 3306,
  database : 'e_learning'
});

router.get('/:id',ValidateJWB('student'),(req,rep,next)=>{
  let tab_id_questions = [];
  con.query("SELECT * FROM question_response WHERE id_course = ?",[req.params.id],(erreur,questions)=>{
    if (erreur) {
      console.log(erreur);
    }else{
        for (let j = 0; j < questions.length; j++)
          tab_id_questions[j] = questions[j].id_question;  // on cherche les options qui appartient a l'ensemble des questions
        con.query("SELECT * FROM options WHERE id_question IN (?)",[tab_id_questions],(erreur,resultat)=>{
          if (erreur)
            console.log(erreur);
          else{
              rep.json({list_question: questions,list_options: resultat})
            }
        })
    }
  })
})

router.post('/add_question',ValidateJWB('former'),(req,rep,next)=>{
  rep.json({message:"ok"})
  con.query("INSERT INTO question_response(_question,_response,id_course) VALUES (?,?,?)",[req.body._question,req.body._response,req.body.id_course],(erreur,resultat)=>{
    if (erreur) {
      console.log(erreur);
    }else{
      con.query("SELECT id_question FROM question_response WHERE _question = ? AND _response = ? AND id_course = ?",[req.body._question, req.body._response, req.body.id_course],(erreur,resultat)=>{
        if (erreur) {
          console.log(erreur);
        }
          for (let i = 0; i <req.body._options.length; i++){
            con.query("INSERT INTO options(_options,id_question) VALUES (?,?)",[req.body._options[i],resultat[0].id_question],(erreur,resultat)=>{
              if (erreur) {
                console.log(erreur);
              }
            })
          }
      })
    }
  })
})

module.exports = router;
