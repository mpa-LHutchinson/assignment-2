var mongoose = require("mongoose");
var Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');
var User;

var userSchema = new Schema({

    "userName": {
        type: String,
        unique: true
    },
    "password": String,
    "email": String,
    "loginHistory": [{
        "dateTime": Date,
        "userAgent": String
    }]

})

exports.initialize = function(){
    return new Promise(function(resolve, reject){
        let tempConnection = mongoose.createConnection(`mongodb+srv://liamhutch:fatratcat@btiassignment6.cbrbjgz.mongodb.net/test`);
        tempConnection.on('error', function(err){
           reject("Error: could not connect to mongodb");
        })
        tempConnection.once('open', function(){
           User = tempConnection.model("users", userSchema);
           resolve();
        })
    });
}

exports.registerUser = function(userData){
    console.log("called registerUser");
    console.log(userData);
    return new Promise(function(resolve, reject){
        if(userData.password != userData.password2){
            console.log("error1");
            reject("Error: Passwords do not match");
        }
        else if (userData.password == "" || userData.password2 == "" || userData.password.trim() == "" || userData.password2.trim() == ""){
            console.log("error2");
            reject("Error: user name cannot be empty or only white spaces!");
        }
        else{
            var newUser = new User(userData);
            newUser.save().then(()=>{
                resolve();
            }).catch(err=>{
                if(err.code == 11000){
                    console.log("error3");
                    reject("User Name already taken");
                }
                else{
                    console.log("error4");
                    console.log(err);
                    reject("There was an error creating the user: " + err);
                }
            });
        }
    });
}

exports.checkUser = function(userData){
    return new Promise(function(resolve, reject){
        User.findOne({ userName: userData.userName })
        .exec()
        .then((foundUser) => {
            if(!foundUser){
                console.log("error 6");
                reject("Unable to find user: " + userData.userName);
            }
            else{
                    if(foundUser.password != userData.password){
                        console.log("error 7");
                        reject("Incorrect Password for user: " + userData.userName);
                    }
                    else{
                        foundUser.loginHistory.push({dateTime: (new Date()).toString(), userAgent: userData.userAgent});
                        User.updateOne(
                            { userName: foundUser.userName},
                            { $set: { loginHistory: foundUser.loginHistory } }
                          ).exec()
                          .then(()=>{
                            resolve(foundUser);
                          })
                          .catch(err=>{
                            reject("There was an error verifying the user: " + err);
                          })
                    }
                
                
            }
        })
        .catch(err=>{
            console.log("error 8");
            reject("Unable to find user: " + userData.userName);
        })

    });
}

