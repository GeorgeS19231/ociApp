import mongoose from "mongoose";
import { trim } from "validator";

const WhenSchema = new mongoose.Schema(
    {
        startDate: { type: Date, required: true },
        endDate: { type: Date },
    },
    { _id: false }
);
const salaryRangeSchema = new mongoose.Schema(
    {
        min: { type: Number, min: 0 },
        max: {
            type: Number, min: 0,
            validate: {
                validator(value) {
                    return value >= this.min
                },
                message: 'Max salary must be greater than min salary'
            },
        },

        _id: false,
        currency: { type: String, trim: true, uppercase: true, required: true }
    }
)

WhenSchema.path("endDate").validate(function (v) {
    if (!v) return true;
    return v >= this.startDate;
}, "endDate must be >= startDate");

const jobSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
            minlength: 3,
        },
        city: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
            minlength: 2,
        },
        companyName: {
            type: String,
            required: true,
            trim: true,
            minlength: 2,
        },
        openedPositions: {
            type: Number,
            default: 1,
            min: 1,
            validate: {
                validator: Number.isInteger,
                message: "openedPositions must be an integer",
            },
        },
        description: {
            type: String,
            required: true,
            trim: true,
            minlength: 30,
        },
        jobType: {
            type: String,
            enum: ['full-time', 'part-time'],
            required: true,
        },
        isRemote: {
            type: Boolean,
            default: false,
        },
        // Prefer URL or storage key, not Buffer:
        backgroundImageUrl: {
            type: String,
            trim: true,
        },
        jobStatus: {
            type: String,
            enum: ['open', 'filled', 'closed'],
            default: 'open',
            index: true,
        },
        when: { type: WhenSchema, required: true },

        salaryRange: { type: salaryRangeSchema, required: true },

        author: {
            type: mongoose.Schema.ObjectId,
            required: true,
            ref: 'User'
        },
        assignments: [{ type: mongoose.Schema.ObjectId, ref: 'Assignment' }]
    },
    {
        timestamps: true,

    }
);

// Auto-fill/close helpers 
jobSchema.pre("save", function (next) {
    if (this.when?.endDate && this.when.endDate < new Date() && this.jobStatus === "open") {
        this.jobStatus = "closed";
    }
    next();
});


// Index for filtering by city and sorting by start date
jobSchema.index({ city: 1, "when.startDate": 1 });

// Index for filtering by job status and sorting by start date
jobSchema.index({ jobStatus: 1, "when.startDate": 1 });

// Index for combining city + jobStatus filters with date sorting
jobSchema.index({ city: 1, jobStatus: 1, "when.startDate": 1 });

// Text index for full-text search on title and description
jobSchema.index({ title: "text", description: "text" });

// Partial unique index to prevent duplicate open jobs (same title, city, start date)
jobSchema.index(
    { title: 1, city: 1, "when.startDate": 1 },
    { unique: true, partialFilterExpression: { jobStatus: "open" } }
);

export const Job = mongoose.model('Job', jobSchema);
