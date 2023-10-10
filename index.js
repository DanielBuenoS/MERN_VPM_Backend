import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import vetRoutes from "./routes/VetRoutes.js";
import patientRoutes from "./routes/patientRoutes.js";

const app = express(); // Create the server
app.use(express.json()); // Enable json for HTTP requests

dotenv.config(); // Read environment variables

connectDB(); 

const allowedDomains = [process.env.FRONTEND_URL];

const corsOptions = {
    origin: function(origin, callback) {
        if(allowedDomains.indexOf(origin) !== -1) {
            // Request origin is allowed
            callback(null, true);
        } else {
            callback(new Error('Not Allowed by CORS Policy'));
        }
    }
};

app.use(cors(corsOptions));

app.use('/api/vets', vetRoutes);
app.use('/api/patients', patientRoutes);

// Port assigment to server
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`);
});