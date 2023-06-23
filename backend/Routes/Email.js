const express = require('express');
var mysql = require('mysql');
const ValidateJWB = require('../middelware/check_authenticate');
const nodemailer = require('nodemailer');

const router = express.Router();

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  port : 3306,
  database : 'e_learning'
});


const transporter = nodemailer.createTransport({ // on Configure un transporteur que nodemailer utilisera pour envoyer les e-mails
  service: 'gmail',
  auth: {
    user: 'education.center.eu@gmail.com' ,
    pass: 'sbocyfyywuhzbngp',
  },
});


router.post('/',ValidateJWB('administrator former student'),(req,rep,next)=>{
 console.log(req.userData.email," ",req.body.email_destinataire);

  const Options_email = { // on cree un objet d'email : ici on Définit les détails de l'e-mail
    from: req.userData.email+" <no-reply.education-center@gmail.com>",
    to: req.body.email_destinataire,
    subject: req.body.sujet,
    html: req.body.text + '<br><br><br>Education Center'
  };

  transporter.sendMail(Options_email, function(erreur, resultat){
    if (erreur) {
      console.log(erreur);
    } else {
      console.log('Email sent: ' + resultat.response);
    }
  });


 })




module.exports = router;
