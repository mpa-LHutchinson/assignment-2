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