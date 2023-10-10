import jwt from "jsonwebtoken";
import Vet from "../models/vet.js";

// Check user authentication
const checkAuth = async (req, res, next) => {
    let token;
    
    // Check for valid token
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            
            const decoded = jwt.verify(token, process.env.JWT_SECRET); // Decode token using secret word in env variables
            req.vet = await Vet.findById(decoded.id).select("-password -token -verified"); // Create an Express user session with the information from DB

            return next(); // Goes to next middleware

        } catch (error) {
            const e = new Error('Invalid Token');
            return res.status(403).json({msg: e.message});
        }
    } 

    if(!token) {
        const error = new Error("Token don't Exist");
        res.status(403).json({msg: error.message});
    }
    
    next();
}

export default checkAuth;