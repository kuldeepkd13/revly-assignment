const express = require("express")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const { UserModel } = require("../models/user.model")
const { auth } = require("../middleware/auth")
const { DoubtModel } = require("../models/doubt.model")

const userRoute = express.Router()

// User register

userRoute.post("/register", async (req, res) => {
    const { name, email, password, userType, userLanguage, classGrade, subjectExpertise, active } = req.body;

    try {
        const user = await UserModel.findOne({ email });

        if (user) {
            return res.status(400).send({ "message": "User Already Present With this Email" });
        }

        bcrypt.hash(password, 5, async (err, hash) => {
            if (err) {
                return res.status(500).send({ "message": "Error hashing password" });
            }

            const newUser = new UserModel({
                name,
                email,
                password: hash,
                userType,
                userLanguage,
                classGrade,
                subjectExpertise,
                active
            });

            await newUser.save();
            res.status(200).send({ message: "Registration successful" });
        });
    } catch (error) {
        res.status(500).send({ "message": error.message });
    }
});

// User login 

userRoute.post("/login",async(req,res)=>{
    const {email,password}=req.body

    try {
        const user = await UserModel.findOne({email})
        if(user){
            bcrypt.compare(password, user.password, async(err, result) =>{
                if(result){
                    res.status(200).send({"message":"Login Successfull" ,user, token : jwt.sign({userId:user._id},'name')})
                }if (err || !result){
                    res.status(400).send({"message":"Incorrect email or password, please try again."})
                }
            });
        }else{
            res.status(400).send({"message":"Incorrect email or password, please try again."})
        }
    } catch (error) {
        res.status(400).send({"message":error.message})
    }
})

// Update tutor active status and last active time
userRoute.put("/updateStatus/", auth ,async (req, res) => {
    const { active } = req.body;
    const userId = req.body.User;

    try {
        const user = await UserModel.findById(userId);

        if (user) {
            if (user.active !== active) {
                // Status is changing, update lastActive time
                user.active = active;
                user.lastActive = Date.now();

                await user.save();
                res.status(200).send({ "message": "User status updated successfully", user });
            } else {
                res.status(400).send({ "message": "User status is already set to the desired value" });
            }
        } else {
            res.status(404).send({ "message": "User not found" });
        }
    } catch (error) {
        res.status(500).send({ "message": error.message });
    }
});



module.exports = {userRoute}