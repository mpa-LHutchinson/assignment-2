/*********************************************************************************
* BTI325 – Assignment 3
* I declare that this assignment is my own work in accordance with Seneca Academic Policy.
* No part of this assignment has been copied manually or electronically from any other source
* (including web sites) or distributed to other students.
*
* Name: Liam Hutchinson Student ID: 184017218 Date: 10/31/2022
*
* Online (Heroku) URL:
* https://arcane-atoll-68489.herokuapp.com/
*
********************************************************************************/ 
var employeeList = [];
var departmentList = [];

exports.initialize = function(){
    const fs = require('node:fs');

    fs.readFile('./data/employees.json',(err,data)=>{
        if (err) reject("Failure to read file employees.json!");
        employeeList = JSON.parse(data);
    });

    fs.readFile('./data/departments.json',(err,data)=>{
        if (err) reject("Failure to read file departments.json!");
        departmentList = JSON.parse(data);
    });

    return new Promise(function(resolve, reject){
        console.log("initialize called");
        resolve("Data succesfully initialized!");
    });
}

exports.getAllEmployees = function(){
    return new Promise(function(resolve, reject){
            console.log("getAllEmployees called");

            resolve(employeeList);
            reject(reason);
    });
}

exports.getManagers = function(){
    return new Promise(function(resolve, reject){
        console.log("getManagers called");
        const managerList = [];

        for(employee of employeeList){
            if(employee.isManager == true){
                managerList.push(employee);
            }
        }

        resolve(managerList);
        reject(reason);
    });
}

exports.getDepartments = function(){
    return new Promise(function(resolve, reject){
            console.log("getDepartments called");

            resolve(departmentList);
            reject(reason);
    });
}

exports.addEmployee = function(employeeData){
    return new Promise(function(resolve, reject){
        console.log("addEmployee called");

        if(employeeData.isManager == null){
            employeeData.isManager = false;
        }
        else{
            employeeData.isManager = true; 
        }

        employeeData.employeeNum = employeeList.length + 1;
        employeeList.push(employeeData);
        resolve();
    });
}

exports.getEmployeesByStatus = function(status){
    return new Promise(function(resolve, reject){
        console.log("getEmployeeByStatus called");
        const tempList = [];
        for(employee of employeeList){
            if(employee.status == status){
                tempList.push(employee);
            }
        }
        resolve(tempList);
    });
}

exports.getEmployeesByDepartment = function(Department){
    return new Promise(function(resolve, reject){
        console.log("getEmployeesByDepartment called");
        const tempList = [];
        for(employee of employeeList){
            if(employee.department == Department){
                tempList.push(employee);
            }
        }
        resolve(tempList);
    });
}

exports.getEmployeesByManager = function(Manager){
    return new Promise(function(resolve, reject){
        console.log("getEmployeesByManager called");
        const tempList = [];
        for(employee of employeeList){
            if(employee.employeeManagerNum == Manager){
                tempList.push(employee);
            }
        }
        resolve(tempList);
    });
}

exports.getEmployeeByNum = function(num){
    return new Promise(function(resolve, reject){
        console.log("getEmployeesByNum called");
        var temp;
        for(employee of employeeList){
            if(employee.employeeNum == num){
                temp = employee;
            }
        }
        resolve(temp);
    });
}