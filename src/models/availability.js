import mongoose from "mongoose";

const AvailabilitySchema = new mongoose.Schema({
    dayOfWeek: {
        type: Number,
        min: 0, max: 6,
        required: true
    },
    startTime: {
        type: String,
        required: true
    }, // 'HH:MM' format
    endTime: {
        type: String,
        required: true
    },
}, { _id: false }); // id false to prevent auto _id generation

export { AvailabilitySchema };