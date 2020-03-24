const monogoose = require('mongoose');

const Schema = monogoose.Schema;

const exerciseSchema = new Schema({
    username: { type: String, required: true },
    description: { type: String, required: true },
    duration: { type: Number, required: true },
    date: { type: Date, require: true }
},
    {
        timestamps: true
    }
);

const Exercise = monogoose.model('Exercise', exerciseSchema);

module.exports =  Exercise;