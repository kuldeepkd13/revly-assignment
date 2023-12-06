// doubt.route.js

const express = require("express");
const { UserModel } = require("../models/user.model");
const { auth } = require("../middleware/auth");
const { DoubtModel } = require("../models/doubt.model");

const doubtRoute = express.Router();

// Route for creating a doubt
doubtRoute.post("/createDoubt", auth, async (req, res) => {
    try {
        // Extracting doubt details from request body
        const studentId = req.body.User;
        const { doubtSubject, doubtDescription } = req.body;

        // Retrieving student data
        const studentData = await UserModel.findById(studentId);

        // Finding online tutors matching student's criteria
        const onlineTutors = await UserModel.find({
            userType: 'Tutor',
            active: true,
            classGrade: studentData.classGrade,
            userLanguage: studentData.userLanguage,
            subjectExpertise: doubtSubject
        });

        let assignedTutor;

        // If no online tutor found, find the tutor who was active recently
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
            // Creating a new doubt instance
            const newDoubt = new DoubtModel({
                studentId,
                tutorId: assignedTutor._id,
                doubtSubject,
                doubtDescription
            });

            // Saving the new doubt to the database
            await newDoubt.save();
            res.status(200).send({ message: 'Doubt created successfully', assignedTutor });
        } else {
            res.status(404).send({ message: 'No eligible tutors found' });
        }
    } catch (error) {
        res.status(400).send({ "message": error.message });
    }
});

// Doubt solution will be given by the assigned tutor
doubtRoute.patch("/doubtSolution/:doubtId", auth, async (req, res) => {
    try {
        // Extracting doubt ID and tutor's answer from request parameters and body
        const doubtId = req.params.doubtId;
        const { tutorAnswer } = req.body;

        // Updating doubt solution in the database
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
        res.status(400).send({ "message": error.message });
    }
});

// List of all the doubts asked by the student
doubtRoute.get("/allDoubt", auth, async (req, res) => {
    try {
        // Retrieving all doubts for the student and sorting by creation time
        const history = await DoubtModel.find({ studentId: req.body.User }).sort({ doubtCreationTime: -1 });

        // Listing all the doubts
        const doubts = history.map((el) => {
            return el.doubtDescription;
        });

        if (history) {
            res.status(200).send({ "message": "List Of All Doubt", doubts });
        } else {
            res.status(400).send({ "message": "No Doubt Created" });
        }
    } catch (error) {
        res.status(400).send({ "message": error.message });
    }
});

// Doubt history with doubt and solution (for doubt history interface)
doubtRoute.get("/doubtHistory", auth, async (req, res) => {
    try {
        // Retrieving doubt history for the student and sorting by creation time
        const history = await DoubtModel.find({ studentId: req.body.User }).sort({ doubtCreationTime: -1 });

        // Constructing a structured doubt history with doubt and solution
        const doubts = history.map((el) => {
            let doubt = el.doubtDescription;
            let Solution = null;

            if (el.doubtSolution) {
                Solution = el.doubtSolution;
            }
            return { doubt, Solution };
        });

        if (history) {
            res.status(200).send({ "message": "Doubt History", doubts });
        } else {
            res.status(400).send({ "message": "No Doubt History" });
        }
    } catch (error) {
        res.status(400).send({ "message": error.message });
    }
});

module.exports = { doubtRoute };
