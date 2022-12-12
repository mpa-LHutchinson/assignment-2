/*********************************************************************************
* BTI325 – Assignment 5
* I declare that this assignment is my own work in accordance with Seneca Academic Policy.
* No part of this assignment has been copied manually or electronically from any other source
* (including web sites) or distributed to other students.
*
* Name: Liam Hutchinson Student ID: 184017218 Date: 11/13/2022
*
* Online (Cyclic) URL:
* https://ill-puce-abalone-gear.cyclic.app/
*
********************************************************************************/
const Sequelize = require('sequelize');
var sequelize = new Sequelize('shocckjc', 'shocckjc', 'SRyUlZhvNsqTH9U9WBlD9fkUZ8wvLYhf', {
 host: 'peanut.db.elephantsql.com',
 dialect: 'postgres',
 port: 5432,
 dialectOptions: {
 ssl: true
},
query:{raw: true} // update here. You need it.
});

sequelize.authenticate().then(()=> console.log('Connection succeeded.'))
.catch((err)=>console.log("Unable to connect to DB.", err));

var Employee = sequelize.define('Employee', {
    employeeNum: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    firstName: Sequelize.STRING,
    lastName: Sequelize.STRING,
    email: Sequelize.STRING,
    SSN: Sequelize.STRING,
    addressStreet: Sequelize.STRING,
    addressCity: Sequelize.STRING,
    addressState: Sequelize.STRING,
    addressPostal: Sequelize.STRING,
    maritalStatus: Sequelize.STRING,
    isManager: Sequelize.BOOLEAN,
    employeeManagerNum: Sequelize.INTEGER,
    status: Sequelize.STRING,
    department: Sequelize.INTEGER,
    hireDate: Sequelize.STRING,
  });
  
  var Department = sequelize.define('Department', {
    departmentId: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    departmentName: Sequelize.STRING,
  });

//part 5

exports.initialize = function(){
    return new Promise(function(resolve, reject){
        sequelize.sync()
        .then(() => resolve("initialize success!"))
        .catch(() => reject("initialize error"));

    });
}

exports.getAllEmployees = function(){
    return new Promise(function(resolve, reject){
        Employee.findAll()
        .then((data) => resolve(data))
        .catch(() => reject("no results"));
      
    });
}

exports.getEmployeesByStatus = function(statusPassed){
    return new Promise(function(resolve, reject){
        Employee.findAll({where:{status: statusPassed}})
        .then((data) => resolve(data))
        .catch(() => reject("no results"));
    });
}

exports.getEmployeesByDepartment = function(departmentPassed){
    return new Promise(function(resolve, reject){
        Employee.findAll({where:{department: departmentPassed}})
        .then((data) => resolve(data))
        .catch(() => reject("no results"));
    });
}

exports.getEmployeesByManager = function(managerPassed){
    return new Promise(function(resolve, reject){
        Employee.findAll({where:{employeeManagerNum: managerPassed}})
        .then((data) => resolve(data))
        .catch(() => reject("no results"));
    });
}

exports.getEmployeeByNum = function(num){
    return new Promise(function(resolve, reject){
        Employee.findAll({where:{employeeNum: num}})
        .then((data) => resolve(data[0]))
        .catch(() => reject("no results"));
    });
}

exports.getDepartments = function(){
    return new Promise(function(resolve, reject){
        Department.findAll()
        .then((data) => resolve(data))
        .catch(() => reject("no results"));
    });
}

exports.addEmployee = function(employeeData){
    return new Promise(function(resolve, reject){
        employeeData.isManager = (employeeData.isManager) ? true : false;

        for (let i in employeeData){
            if (employeeData[i] === ''){
                employeeData[i] = null;
            }
        }
        Employee.create(employeeData)
        .then((data) => resolve(data))
        .catch(() => reject("no results"));
    });
}

exports.updateEmployee = function(employeeData){
    return new Promise(function(resolve, reject){
        employeeData.isManager = (employeeData.isManager) ? true : false;

        for (let i in employeeData){
            if (employeeData[i] === ''){
                employeeData[i] = null;
            }
        }
        Employee.update(employeeData, {
            where: { employeeNum: employeeData.employeeNum },
          })
        .then((data) => resolve(data))
        .catch(() => reject("no results"));
    });
}

//part 7

exports.addDepartment = function(departmentData){
    return new Promise(function(resolve, reject){

        for (let i in departmentData){
            if (departmentData[i] === ''){
                departmentData[i] = null;
            }
        }
        Department.create(departmentData)
        .then((data) => resolve(data))
        .catch(() => reject("no results"));
    });
}

exports.updateDepartment = function(departmentData){
    return new Promise(function(resolve, reject){
        for (let i in departmentData){
            if (departmentData[i] === ''){
                departmentData[i] = null;
            }
        }
        Department.update(departmentData, {
            where: { departmentId: departmentData.departmentId },
          })
        .then((data) => resolve(data))
        .catch(() => reject("no results"));
    });
}

exports.getDepartmentById = function (id) {
    return new Promise((resolve, reject) => {
      Department.findAll({
        where: {
          departmentId: id,
        },
      })
        .then((data) => resolve(data))
        .catch(() => reject("no results"))
    });
  };

exports.getManagers = function(){
    return new Promise(function(resolve, reject){
        Employee.findAll({
            where: {
              employeeManagerNum: manager,
            },
          })
            .then((data) => {
              resolve(data);
            })
            .catch((err) => {
              reject("no results");
            });
        });
    }

exports.getEmployeesByDepartment = function(departmentPassed){
    return new Promise(function(resolve, reject){
        resolve(Employee.findAll({where:{department: departmentPassed}}));
    });
}

exports.getEmployeesByManager = function(managerPassed){
    return new Promise(function(resolve, reject){
        resolve(Employee.findAll({where:{employeeManagerNum: managerPassed}}));
    });
}

exports.deleteEmployeeByNum = function (num) {
    return new Promise((resolve, reject) => {
      Employee.destroy({
        where: {
          employeeNum: num,
        },
      })
        .then(() => resolve())
    });
  };