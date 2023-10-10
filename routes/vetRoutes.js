import express from "express";
import {
    register, 
    profile, 
    verification,
    auth,
    passwordReset,
    checkToken,
    newPassword,
    updateProfile,
    updatePassword
} from "../controllers/vetController.js";
import checkAuth from "../middleware/authMiddleware.js";

// Use Express Router
const router = express.Router();

// Define routes

// Public routes
router.post('/', register);
router.get('/verification/:token', verification);
router.post('/login', auth);
router.post('/password-reset', passwordReset);
router.route('/password-reset/:token').get(checkToken).post(newPassword);

// Private routes
router.get('/profile', checkAuth, profile);
router.put('/profile/:id', checkAuth, updateProfile);
router.put('/update-password', checkAuth, updatePassword);


export default router;