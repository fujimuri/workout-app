const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const SingleExerciseSchema = new Schema({
    exerciseName: { type: String },
    setLog: [{
        weight: { type: Number },
        sets: { type: Number },
        reps: { type: Number },
    }],
});

module.exports =
mongoose.model("SingleExercise", SingleExerciseSchema);