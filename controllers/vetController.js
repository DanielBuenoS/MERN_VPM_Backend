import mongoose from "mongoose";
import Vet from "../models/Vet.js"
import generateJWT from "../helpers/generateJWT.js";
import generateId from "../helpers/generateId.js";
import signUpEmail from "../helpers/signUpEmail.js";
import passwordResetEmail from "../helpers/passwordResetEmail.js";

const register = async (req, res) => {
    
    const {email, name} = req.body;

    // Prevent duplicated entries
    const userExist = await Vet.findOne({email});

    if(userExist) {
        const error = new Error('User already exists');
        return res.status(400).json({msg: error.message});
    }

    try {
        // Register a new vet
        const vet = new Vet(req.body);

        const savedVet = await vet.save();

        // Send verification email
        signUpEmail({
            email,
            name,
            token: savedVet.token 
        });

        res.json(savedVet);

    } catch (error) {
        console.log(error);
    }

};

const profile = (req, res) => {
    const {vet} = req;
    res.json({vet});
};

// Account validation by unique token
const verification = async (req, res) => {
    const {token} = req.params;

    const userToVerify = await Vet.findOne({token});

    if(!userToVerify) {
        const error = new Error('Invalid Token');
        return res.status(404).json({msg: error.message});
    }

    try {
        userToVerify.token = null;
        userToVerify.verified = true;
        await userToVerify.save();

        res.json({msg: 'User verified succesfully'});    
    } catch (error) {
        console.log(error);
    }
    
};

// User authentication
const auth = async (req, res) => {
    const {email, password} = req.body;

    // Check if user exists
    const user = await Vet.findOne({email});

    if(!user) {
        const error = new Error('User not Found');
        return res.status(404).json({msg: error.message});
    } 

    // Check if user is verified
    if(!user.verified) {
        const error = new Error("Your email hasn't been verified");
        return res.status(403).json({msg: error.message});
    }

    // Check if password matches
    if(await user.checkPassword(password)) {
        // Authentication with JSON Web Token (JWT)
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateJWT(user.id)
        });
    } else {
        const error = new Error("Invalid Password");
        return res.status(403).json({msg: error.message});
    }
};

// Forgotten password reset
const passwordReset = async (req, res) => {
    const {email} = req.body;

    const vetExists = await Vet.findOne({email});

    // Check if email exists in DB for password reset
    if(!vetExists) {
        const error = new Error("Vet not Found");
        return res.status(400).json({msg: error.message});
    }

    // Generates a temporary ID for password reset
    try {
        vetExists.token = generateId();
        await vetExists.save();

        // Send email with link to reset password
        passwordResetEmail({
            email,
            name: vetExists.name,
            token: vetExists.token
        });

        res.json({msg: 'An email has been sent with instructions to reset your password'});
    } catch (error) {
        console.log(error)
    }
}

const checkToken = async (req, res) => {
    const {token} = req.params;

    const validToken = await Vet.findOne({token});

    if(validToken) {
        res.json({msg: 'Valid Token'});
    } else {
        const error = new Error('Invalid Token');
        return res.status(400).json({msg: error.message});
    }
}

const newPassword = async (req, res) => {
    const {token} = req.params;
    const {password} = req.body;

    const vet = await Vet.findOne({token});

    if(!vet) {
        const error = new Error('Token not Found');
        return res.status(400).json({msg: error.message});
    }

    try {
        vet.token = null;
        vet.password = password;
        await vet.save();
        res.json({msg: 'Password changed successfully'});
    } catch (error) {
        console.log(error);
    }

}

const updateProfile = async (req, res) => {
    const vet = await Vet.findById(req.params.id);

    if(!vet) {
        const error = new Error('Vet not found');
        return res.status(400).json({msg: error.message});
    }

    const {email} = req.body;
    if(vet.email !== req.body.email) {
        const emailExists = await Vet.findOne({email});
        if(emailExists) {
            const error = new Error('Email already in use');
            return res.status(400).json({msg: error.message});
        }
    }

    try {
        vet.name = req.body.name;  
        vet.email = req.body.email; 
        vet.telephone = req.body.telephone;
        vet.website = req.body.website;

        const updatedVet = await vet.save();

        res.json(updatedVet);
        
    } catch (error) {
        console.log(error)
    }
}

const updatePassword = async (req, res) => {
    // Read data
    const {id} = req.vet;
    const {current_password, new_password} = req.body;

    // Check if vet exists
    const vet = await Vet.findById(id);

    if(!vet) {
        const error = new Error('Vet not found');
        return res.status(400).json({msg: error.message});
    }

    // Check if current password matches with DB
    if(await vet.checkPassword(current_password)) {
        // Save new password
        vet.password = new_password;
        await vet.save();
        res.json({msg: 'Password updated successfully'});
    } else {
        const error = new Error('Wrong current password');
        return res.status(400).json({msg: error.message});
    }
    
}

export {
    register,
    profile,
    verification,
    auth,
    passwordReset,
    checkToken,
    newPassword,
    updateProfile,
    updatePassword
};