import mongoose from "mongoose";
import { User } from "../models/user.js";
import bcrypt from "bcryptjs";

// Middleware to check if the user's account is activated
export const checkAccountActivation = async (req, res, next) => {
    try {
        const userEmail = req.body.email;
        const user = await User.findOne({ email: userEmail });

        if (!user) {
            return res.status(404).send({ error: 'User not found' });
        }


        // If user is not verified yet, mark the code as passed
        if (!user.isVerified) {
            const isTokenMatching = await bcrypt.compare(`${user._id}:${req.body.verificationCode}:${process.env.OTP_PEPPER}`,
                user.verificationToken[0].token);
            if (isTokenMatching) {
                req.verificationSuccess = true;
                user.isVerified = true;
            } else {
                // If there are 3 failed attempts to acctivate the account, then next one will trigger a token clean up
                if (user.verificationToken[0].failedAttempts === 3) {
                    user.verificationToken = [];
                    return res.status(400).send({ error: 'Too many failed attempts. Please request a new verification code.' });
                } else {
                    user.verificationToken[0].failedAttempts += 1;
                    return res.status(400).send({ error: 'Invalid verification code' });
                }
            }
            await user.save();

        }
        
        next()
    } catch (error) {
        res.status(500).send({ error: 'Internal server error' });
    }
};