const http = require("http");
const app = require("./backend/app");
const express = require('express');


const port = process.env.port || 3000;

console.log(port);
//app.set("port",port);
const server = http.createServer(app);



server.listen(port);
