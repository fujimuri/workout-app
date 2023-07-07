const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { DateTime } = require("luxon");

const WorkoutLogSchema = new Schema({
    date: { type: Date, default: Date.now },
    user_id: { type: String, default: 0 },
    exerciseList: [{
        type: Schema.Types.ObjectId,
        ref: "SingleExercise"}]
});

WorkoutLogSchema.virtual("date_formatted").get(function () {
    return DateTime.fromJSDate(this.date).toLocaleString(DateTime.DATETIME_MED);
});

module.exports =
mongoose.model("WorkoutLog", WorkoutLogSchema);