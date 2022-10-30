/*********************************************************************************
* BTI325 – Assignment 3
* I declare that this assignment is my own work in accordance with Seneca Academic Policy.
* No part of this assignment has been copied manually or electronically from any other source
* (including web sites) or distributed to other students.
*
* Name: Liam Hutchinson Student ID: 184017218 Date: 10/31/2022
*
* Online (Heorku) URL:
* 
*
********************************************************************************/ 
var express = require("express");
var app = express();
var path = require("path");
var data = require("./data-service");
var multer = require("multer");
const fs = require('node:fs');
app.use(express.json());
app.use(express.urlencoded({extended: true}));

var HTTP_PORT = process.env.PORT || 8080;

var storage = multer.diskStorage({
  destination: "./public/images/uploaded",
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

var upload = multer({ storage: storage });

app.post("/images/add", upload.single("imageFile"), (req, res) => {
  res.redirect("/images");
});

app.get("/images", function(req,res){
  fs.readdir("./public/images/uploaded", (err, items) => {
    if(err)
      console.log(err);
    else{
      res.json({images: items})
    }
  });
});

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

  if(req.query.status){
    var status = req.query.status;
    data.getEmployeesByStatus(status)
    .then((data) => { res.json(data) })
    .catch((err) => { res.json({message: err}) });
    return;
  }
  else if(req.query.department){
    var department = req.query.department;
    data.getEmployeesByDepartment(department)
    .then((data) => { res.json(data) })
    .catch((err) => { res.json({message: err}) });
    return;
  }
  else if(req.query.manager){
    var manager = req.query.manager;
    data.getEmployeesByManager(manager)
    .then((data) => { res.json(data) })
    .catch((err) => { res.json({message: err}) });
    return;
  }
  else{
    data.getAllEmployees()
    .then((data) => { res.json(data) })
    .catch((err) => { res.json({message: err}) });
    return;
  }

});

app.get("/employee/:value", function(req,res){
  var value = req.params.value;

  data.getEmployeeByNum(value)
    .then((data) => { res.json(data) })
    .catch((err) => { res.json({message: err}) });

});

app.get("/employees/add", function(req,res){
  res.sendFile(path.join(__dirname,"/views/addEmployee.html"));
});

app.post("/employees/add", function(req,res){
  data.addEmployee(req.body)
  .then(() => { res.redirect("/employees") })
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

app.get("/images/add", function(req,res){
  res.sendFile(path.join(__dirname,"/views/addImage.html"));
});

app.get("*", function(req,res){
  res.send("Error 404: Page not found.");
});

data.initialize()

.then(() => {app.listen(HTTP_PORT, onHttpStart)})

.catch(function(reason){
  console.log(reason);
});