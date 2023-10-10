import mongoose from "mongoose";
import bcrypt from "bcrypt";
import generateId from "../helpers/generateId.js";


// Define DB schema, MongoDB auto-assigns ID
const vetSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    telephone: {
        type: String,
        default: null,
        trim: true
    },
    website: {
        type: String,
        default: null
    },
    token: {
        type: String,
        default: generateId(),
    },
    verified: {
        type: Boolean,
        default: false
    }
});

// Password hashing before saving entry in the DB
vetSchema.pre('save', async function(next) {
    if(!this.isModified('password')){
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Check if password matches
vetSchema.methods.checkPassword = async function(passToCompare) {
    return await bcrypt.compare(passToCompare, this.password);
};

// Define DB Vet model
const Vet = mongoose.model('Vet', vetSchema);

export default Vet;