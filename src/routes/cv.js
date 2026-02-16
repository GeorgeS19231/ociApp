import express from "express";
import cvModule from '../modules/curriculumvitae/cv.module.js';
import { auth } from '../middleware/auth.js';


export const cvRoute = express.Router();
const { cvController } = cvModule;


// Path for getting the user a specific cv
//
cvRoute.get('/cv/:id', auth, cvController.getCv);

// Path for creating a new CV
//
cvRoute.post('/cv', auth, cvController.createNewCv);

// Path for updating a CV based on cv id
//
cvRoute.patch('/cv/:id', auth, cvController.updateCv);

// Path for removing a CV bansed on cv id
//
cvRoute.delete('/cv/:id', auth, cvController.removeCv);