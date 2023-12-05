const express = require("express")

const { UserModel } = require("../models/user.model")


const tutorRoute = express.Router()




// tutor availabilty and the ping time

tutorRoute.post('/ping', async (req, res) => {
    try {
        const tutorId = req.body.tutorId;

        const tutor = await UserModel.findById(tutorId);

        if (!tutor) {
            return res.status(404).send({ message: 'Tutor not found' });
        }

        // Update the lastActive time only if the tutor is currently active
        if (tutor.active) {
            tutor.lastActive = new Date();
        }

        await tutor.save();

        res.status(200).send({ message: 'Ping updated successfully' });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

module.exports = {tutorRoute}