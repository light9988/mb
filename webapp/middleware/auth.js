import bcrypt from 'bcrypt';
import User from '../models/user.js';
import Assignment from '../models/assignment.js';

// Middleware function to verify the authorization token for Basic Authentication
export const verifyToken = async (req, res, next) => {
    try {
        // Retrieve the Authorization header from the request
        let token = req.header("Authorization");
        // If the token is absent, return a 401 Unauthorized status
        if (!token) {
            console.log("No Authorization token provided.");
            return res.set("WWW-Authenticate", "Basic").status(401).send();
        }
        // Decode the base64 encoded username:password from the token
        const credentials = Buffer.from(token.split(" ")[1], "base64").toString().split(":");
        const username = credentials[0]
        const password = credentials[1];
        // console.log("username: " + username);
        // console.log("password: " + password);
        // Find the user by the provided username
        const user = await User.findOne({ where: { username: username } });
        // If user is not found, return 401 Unauthorized
        if (!user) {
            console.log("User not found.");
            return res.set("WWW-Authenticate", "Basic").status(401).json();
        }
        // Check if the provided password matches the user's password
        const isMatch = await bcrypt.compare(password, user.password);
        // If password doesn't match, return 401 Unauthorized
        if (!isMatch) {
            console.log("Incorrect password.");
            return res.set("WWW-Authenticate", "Basic").status(401).json();
        }
        console.log("User is authorized to access this route.");
        next(); 
    } catch (error) {
        // If any error occurs, return a 400 Bad Request
        return res.status(400).send();
    }
}

