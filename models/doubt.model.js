const mongoose = require("mongoose")


const doubtSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    tutorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    doubtSubject: {
        type: String,
        required: true
    },
    doubtDescription: {
        type: String,
        required: true
    },
    doubtSolution: {
        type: String,
        default: null  
    },
    doubtCreationTime: {
        type: Date,
        required: true,
        default: Date.now
    },
}, {
    versionKey: false
});

const DoubtModel = mongoose.model("doubt" , doubtSchema)

module.exports = {DoubtModel}