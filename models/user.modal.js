const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3,
        maxlength: 20
    },
    password: {
        type: String,
        required: true,
        unique: true,
        maxlength: 120
    }
},
{
    timestamps: true
});

const User = mongoose.model('User', userSchema);

module.exports = User;