/*********************************************************************************
* BTI325 – Assignment 4
* I declare that this assignment is my own work in accordance with Seneca Academic Policy.
* No part of this assignment has been copied manually or electronically from any other source
* (including web sites) or distributed to other students.
*
* Name: Liam Hutchinson Student ID: 184017218 Date: 11/13/2022
*
* Online (Heorku) URL:
* https://arcane-atoll-68489.herokuapp.com/
*
********************************************************************************/ 
var express = require("express");
var app = express();
var path = require("path");
var data = require("./data-service");
var multer = require("multer");
var exphbs = require("express-handlebars");
const {engine} = require("express-handlebars");
const fs = require('node:fs');

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(function(req,res,next){
  let route = req.baseUrl + req.path;
  app.locals.activeRoute = (route == "/") ? "/" : route.replace(/\/$/, "");
  next();
 });

app.engine('.hbs', engine({ extname: '.hbs', helpers: {

  navLink: function(url, options){
    return '<li' +
    ((url == app.locals.activeRoute) ? ' class="active" ' : '') +
    '><a href=" ' + url + ' ">' + options.fn(this) + '</a></li>';
   },
   
   equal: function (lvalue, rvalue, options) {
    if (arguments.length < 3)
    throw new Error("Handlebars Helper equal needs 2 parameters");
    if (lvalue != rvalue) {
    return options.inverse(this);
    } else {
    return options.fn(this);
    }
   } 
   
}, defaultLayout: 'main'}));
app.set('view engine', '.hbs');

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

app.get("/images", (req, res) => {
    fs.readdir("./public/images/uploaded", function(err, items){
        res.render("images",  { data: items, title: "Images" });
    })

})

function onHttpStart() {
  console.log("Express http server listening on: " + HTTP_PORT);
}

app.use(express.static('public'));

app.get("/", function(req,res){
    res.render('home');
});

app.get("/about", function(req,res){
    res.render('about');
});

app.get('/employee/:empNum', (req, res) => {
  let viewData = {};
  data
    .getEmployeeByNum(req.params.empNum)
    .then((data) => {
      if (data) {
        viewData.employee = data;
      } else {
        viewData.employee = null;
      }
    })
    .catch(() => {
      viewData.employee = null;
    })
    .then(data.getDepartments)
    .then((data) => {
      viewData.departments = data;
      for (let i = 0; i < viewData.departments.length; i++) {
        if (viewData.departments[i].departmentId == viewData.employee.department) {
          viewData.departments[i].selected = true;
        }
      }
    })
    .catch(() => {
      viewData.departments = [];
    })
    .then(() => {
      if (viewData.employee == null) {
        res.status(404).send('Employee Not Found');
      } else {
        res.render('employee', { viewData: viewData });
      }
    });
});

app.post("/employee/update", (req, res) => {

  console.log(req.body);
  
  data.updateEmployee(req.body)
    .then((data) => {res.redirect("/employees");})
    .catch((err) => { res.render({message: "no results"})});
  
 });

app.get("/employees", function(req,res){

  if(req.query.status){
    var status = req.query.status;
    data.getEmployeesByStatus(status)
    .then((data) => { if(data.length > 0){res.render("employees", {employees: data})}
    else{res.render("employees",{message: "no results"})};})
    .catch((err) => { res.render({message: "no results"})  });
    return;
  }
  else if(req.query.department){
    var department = req.query.department;
    data.getEmployeesByDepartment(department)
    .then((data) => { if(data.length > 0){res.render("employees", {employees: data})}
    else{res.render("employees",{message: "no results"})};})
    .catch((err) => { res.render({message: "no results"}) });
    return;
  }
  else if(req.query.manager){
    var manager = req.query.manager;
    data.getEmployeesByManager(manager)
    .then((data) => { if(data.length > 0){res.render("employees", {employees: data})}
    else{res.render("employees",{message: "no results"})};})
    .catch((err) => { res.render({message: "no results"}) });
    return;
  }
  else{
    data.getAllEmployees()
    .then((data) => { if(data.length > 0){res.render("employees", {employees: data})}
    else{res.render("employees",{message: "no results"})};})
    .catch((err) => { res.render({message: "no results"}) });
    return;
  }

});

app.get('/employees/add', (req, res) => {
  data.getDepartments()
    .then(function (data) {
      res.render('addEmployee', { departments: data });
    })
    .catch(() => res.render('addEmployee', { departments: [] }));
});

app.post("/employees/add", function(req,res){
  data.addEmployee(req.body)
  .then(() => { res.redirect("/employees") })
  .catch((err) => { res.json({message: err}) });
});

//part 8

app.get("/departments/add", function(req,res){
  res.render('addDepartment');
});

app.post('/departments/add', (req, res) => {
  data.addDepartment(req.body)
    .then(() => res.redirect('/departments'))
    .catch((err) => res.json({ message: err }));
});

app.post('/departments/update', (req, res) => {
  data.updateDepartment(req.body)
    .then(res.redirect('/departments'))
    .catch((err) => res.json({ message: err }));
});

app.get('/department/:departmentId', (req, res) => {
  data.getDepartmentById(req.params.departmentId)
    .then((data) => {
      if (data.length > 0) {
        res.render('department', { department: data })
      }
      else {
        res.status(404).send("Department Not Found");
      }
    })
    .catch(() => {
      res.status(404).send("Department Not Found");
    });
});



app.get("/departments", function(req,res){
  data.getDepartments()
  .then((data) => { if(data.length > 0){res.render("departments", {departments: data})}
    else{res.render("departments",{message: "no results"})};})
  .catch((err) => { res.json({message: err}) });
});

app.get("/managers", function(req,res){
  data.getManagers()
  .then((data) => { res.json(data) })
  .catch((err) => { res.json({message: err}) });
});

app.get("/images/add", function(req,res){
  res.render('addImage');
});

app.get('/employees/delete/:empNum', (req, res) => {
  data.deleteEmployeeByNum(req.params.empNum)
    .then(() => res.redirect('/employees'))
    .catch(() => res.status(500).send('delete employee error'));
});

app.get("*", function(req,res){
  res.send("Error 404: Page not found.");
});

data.initialize()
.then(() => {app.listen(HTTP_PORT, onHttpStart)})
.catch(function(reason){
  console.log(reason);
});