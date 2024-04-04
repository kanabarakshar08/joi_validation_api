const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const Joi = require('joi');


const imagePath = "/upload";

const RegisterSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    Mobile_Number: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true,
    },
    IsActive: {
        type: Boolean,
    },
    Create_Date: {
        type: String,
    },
    Update_Date: {
        type: String,
    }
});

const ImageStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, "..", imagePath));
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + "-" + Date.now());
    }
});

RegisterSchema.statics.uploadImage = multer({ storage: ImageStorage }).single("image");
RegisterSchema.statics.imagePath = imagePath;

// Joi validation schema
const registerValidationSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    Mobile_Number: Joi.string().required(),
    image: Joi.string(),
    IsActive: Joi.boolean(),
    Create_Date: Joi.string(),// Corrected default value
    Update_Date: Joi.string()
});

// Joi validation middleware
RegisterSchema.pre('save', async function (next) {
    try {
        await registerValidationSchema.validate(this);
        next();
    } catch (error) {
        next(new Error(error.details[0].message));
    }
});



const registerData = mongoose.model('Admin_Register', RegisterSchema);
module.exports = registerData;
