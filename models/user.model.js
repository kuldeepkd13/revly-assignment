const mongoose = require("mongoose")

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    password : {
        type : String,
        required : true,
    },
    userType: {
        type: String,
        enum: ['Student', 'Tutor'],
        required: true
    },
    userLanguage: {
        type: String,
        required: true
    },
    classGrade: {
        type: String, 
        required: true
    },
    subjectExpertise: {
        type: String, 
        required: function() {
            return this.userType === 'Tutor';
        }
    },
    active: {
        type: Boolean,
        default: true
    },
    lastActive: {
        type: Date,
        default: Date.now
    },
},{
    versionKey: false
})


const UserModel = mongoose.model("user" , userSchema)

module.exports = {UserModel}