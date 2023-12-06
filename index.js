const express = require("express");
const { connection } = require("./config/db");
const { userRoute } = require("./routes/user.routes");
const { UserModel } = require("./models/user.model");
const axios = require("axios");
const cron = require("node-cron");
const { doubtRoute } = require("./routes/doubt.route");
const { tutorRoute } = require("./routes/tutor.routes");

const app = express();

require("dotenv").config();

app.use(express.json());

// Default route
app.get("/" ,(req,res)=>{
res.send({"message":"Real-Time Doubt Solving Platform"})
})

// User, doubt, and tutor routes
app.use("/user", userRoute);
app.use("/doubt" , doubtRoute);
app.use("/tutor" , tutorRoute)

// Start the server
app.listen(process.env.port, async () => {
    try {
        // Connect to MongoDB
        await connection;
        console.log("Connected to MongoDb");
    } catch (error) {
        console.log(error);
        console.log("Not Connected To MongoDb");
    }

    console.log(`server is running at ${process.env.port}`);
});


// Array to store active tutor IDs
const tutorIds = []; 


// Interval for pinging tutors
const pingInterval = 3000; 

// Set up the CRON job to run every second
cron.schedule('* * * * * *', async () => {
    try {
        // Find all active tutors
        const activeTutors = await UserModel.find({ userType: "Tutor", active: true });

       // Update the tutor IDs array
        tutorIds.length = 0; 
        activeTutors.forEach((tutor) => tutorIds.push(tutor._id));

        // Log the current active tutors count
        console.log('Real-time Available Tutors:', tutorIds.length);
    } catch (error) {
        console.error('Error counting real-time available tutors:', error);
    }
});

// Run the ping and updating the lastpingtime in every 3 sec
setInterval(async () => {
    try {
        
       // Ping each active tutor
        for (const tutorId of tutorIds) {
            await axios.post('https://graceful-gray-leggings.cyclic.app/tutor/ping', { tutorId });
        }
    } catch (error) {
        console.error('Error pinging tutors:', error);
    }
}, pingInterval);
