const express = require("express");
const bodyparser = require("body-parser");
const path = require("path");

const app = express();
const CourseRoute = require('./Routes/Course');
const loginRoute = require('./Routes/Login');
const trainingRoute = require('./Routes/training')
const quizRoute = require('./Routes/Quiz')
const certificateRoute = require('./Routes/Certificate')
const emailRoute = require('./Routes/Email');

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:false}));
// donner l'acces au dossier images
app.use("/images",express.static(path.join("backend/images")))


app.use((req ,res, next)=>{
  res.setHeader("Access-Control-Allow-Origin",'*');
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept , Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS");
  next();
});

// http://localhost:3000/course
app.use("/course",CourseRoute);
// http://localhost:3000/login
app.use("/login",loginRoute);
app.use("/training",trainingRoute);
app.use("/quiz",quizRoute);
app.use("/certificate",certificateRoute);
app.use("/email",emailRoute);
/*app.post('/course',(req,rep,next)=>{
  console.log(req.body);
  rep.send(req.body);

})*/

module.exports = app;


