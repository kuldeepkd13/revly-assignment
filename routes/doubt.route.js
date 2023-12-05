const express = require("express")

const { UserModel } = require("../models/user.model")
const { auth } = require("../middleware/auth")
const { DoubtModel } = require("../models/doubt.model")

const doubtRoute = express.Router()



// route for creating a doubt

doubtRoute.post("/createDoubt", auth, async(req,res)=>{

    try {
        const studentId = req.body.User
        const {  doubtSubject, doubtDescription } = req.body;

        const studentData = await UserModel.findById(studentId )

        // finds all the online tutors who match the student's class grade, language, and doubt subject

        const onlineTutors = await UserModel.find({
            userType: 'Tutor',
            active: true, 
            classGrade: studentData.classGrade, 
            userLanguage: studentData.userLanguage,
            subjectExpertise: doubtSubject
        })

        let assignedTutor;

        // if  no online tutor found then find the tutor who was active recently

        if (onlineTutors.length > 0) {
            assignedTutor = onlineTutors[0]; 
        } else {
            assignedTutor = await UserModel.findOne({
                userType: 'Tutor',
                classGrade: studentData.classGrade, 
                userLanguage: studentData.userLanguage,
                subjectExpertise: doubtSubject
            }).sort({ lastActive: -1 });
        }

        if (assignedTutor) {
            const newDoubt = new DoubtModel({
                studentId,
                tutorId: assignedTutor._id,
                doubtSubject,
                doubtDescription
                
            });

            await newDoubt.save();
            res.status(200).send({ message: 'Doubt created successfully', assignedTutor });
        }else {
            res.status(404).send({ message: 'No eligible tutors found' });
        }
    } catch (error) {
        res.status(400).send({"message":error.message})
    }
})


// doubtSolution will be given by the assigned tutor 

doubtRoute.patch("/doubtSolution/:doubtId" , auth , async(req,res)=>{

    try {
        const doubtId = req.params.doubtId;
        const { tutorAnswer } = req.body;

        const doubt = await DoubtModel.findOneAndUpdate(
            { _id: doubtId, tutorId: req.body.User },
            { doubtSolution: tutorAnswer },
            { new: true }
        );

        if (!doubt) {
            return res.status(404).send({ message: 'Doubt not found or you are not the assigned tutor' });
        }

        res.status(200).send({ message: 'Doubt answered successfully', doubt });
        
    } catch (error) {
        res.status(400).send({"message":error.message})
    }

})

// list of all the doubts asked by the student 

doubtRoute.get("/allDoubt" , auth , async(req,res)=>{
    try {
        
        const history = await DoubtModel.find({studentId : req.body.User}).sort({ doubtCreationTime: -1 })

        //  list all the doubts

        const doubts = history.map((el)=>{
            return el.doubtDescription
        })
        if (history) {
            res.status(200).send({"message":"List Of All Doubt" , doubts})
        }else{
            res.status(400).send({"message":"No Doubt Created"})
        }
    } catch (error) {
        res.status(400).send({"message":error.message})
    }
})

//  Doubt History with Doubt and solution (for doubt history interface)

doubtRoute.get("/doubtHistory" , auth , async(req,res)=>{
    try {
        
        const history = await DoubtModel.find({studentId : req.body.User}).sort({ doubtCreationTime: -1 })


        const doubts = history.map((el)=>{
            let doubt = el.doubtDescription
            let Solution = null;

            if(el.doubtSolution){
                Solution = el.doubtSolution
            }
            return { doubt  , Solution }
        })
        if (history) {
            res.status(200).send({"message":"Doubt History" , doubts})
        }else{
            res.status(400).send({"message":"No Doubt History"})
        }
    } catch (error) {
        res.status(400).send({"message":error.message})
    }
})


module.exports = {doubtRoute}