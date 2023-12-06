// auth.middleware.js

const jwt = require("jsonwebtoken");

// Middleware for authentication using JWT
const auth = (req, res, next) => {
    // Extracting the token from the request headers
    const token = req.headers.authorization;

    if (token) {
        try {
            // Verifying the token using the secret key 'name'
            const decoded = jwt.verify(token, 'name');

            // Adding the decoded user ID to the request body
            req.body.User = decoded.userId;
            
            // Move to the next middleware or route handler
            next();
        } catch (error) {
            // Token verification failed
            res.status(400).send({ "message": "Invalid token" });
        }
    } else {
        // Token not provided
        res.status(400).send({ "message": "Login first" });
    }
};

module.exports = { auth };
