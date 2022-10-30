/*********************************************************************************
* BTI325 – Assignment 2
* I declare that this assignment is my own work in accordance with Seneca Academic Policy.
* No part of this assignment has been copied manually or electronically from any other source
* (including web sites) or distributed to other students.
*
* Name: Liam Hutchinson Student ID: 184017218 Date: 10/09/2022
*
* Online (Cyclic) URL:
* https://ill-puce-abalone-gear.cyclic.app/
*
********************************************************************************/ 
var express = require("express");
var app = express();
var path = require("path");
var data = require("./data-service");

var HTTP_PORT = process.env.PORT || 8080;

function onHttpStart() {
  console.log("Express http server listening on: " + HTTP_PORT);
}

app.use(express.static('public'));

app.get("/", function(req,res){
    res.sendFile(path.join(__dirname, "/views/home.html")); 
});

app.get("/about", function(req,res){
    res.sendFile(path.join(__dirname, "/views/about.html"));
});

app.get("/employees", function(req,res){
  data.getAllEmployees()
  .then((data) => { res.json(data) })
  .catch((err) => { res.json({message: err}) });
});

app.get("/departments", function(req,res){
  data.getDepartments()
  .then((data) => { res.json(data) })
  .catch((err) => { res.json({message: err}) });
});

app.get("/managers", function(req,res){
  data.getManagers()
  .then((data) => { res.json(data) })
  .catch((err) => { res.json({message: err}) });
});

app.get("*", function(req,res){
  res.send("Error 404: Page not found.");
});

data.initialize()

.then(() => {app.listen(HTTP_PORT, onHttpStart)})

.catch(function(reason){
  console.log(reason);
});