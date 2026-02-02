import mongoose from "mongoose";
import validator from "validator";


const previousJobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        maxlength: 50,
        minlength: 2
    },
    company: {
        type: String,
        required: true,
        maxlength: 50,
        minlength: 2
    },
    fromDate: {
        type: Date,
        required: true,
    },
    toDate: {
        type: Date,
        required: false,
    },
    description: {
        type: String,
        maxlength: 2000,
        minlength: 20
    }
}
);

const educationSchema = new mongoose.Schema({
    institution: {
        type: String,
        required: true,
        maxlength: 100,
        minlength: 2,
    },
    degree: {
        type: String,
        required: true,
        maxlength: 100,
        minlength: 2
    },
    fieldOfStudy: {
        type: String,
        required: true,
    },
    fromDate: {
        type: Date,
        required: true,
    },
    toDate: {
        type: Date,
    }
});

const cvSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    description: {
        type: String,
        max: 2000,
    },
    skills: [String],
    previousJobs: [previousJobSchema],
    education: [educationSchema],
    hobbies: [String],
    languages: [{
        type: String,
        minlength: 2,
        maxlength: 25,
    }]
});

export const CvSchema = mongoose.model('CV', cvSchema);