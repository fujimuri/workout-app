const express = require('express');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
const cors = require('cors');
app.use(cors());
// controller
const workout_controller =
require('./controllers/workoutController');
// db stuff
// connect to database
const dotenv = require("dotenv").config();
const mongoDB = process.env.MONGODB;
console.log(mongoDB);
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(mongoDB);
  console.log(mongoose.connection.readyState);
}
// end code

const DATA = [
    { exerciseName: "Squat",
      setLog: [
        {weight: 65, sets: 1, reps: 5},
        {weight: 55, sets: 2, reps: 5},
        {weight: 45, sets: 1, reps: 5},
      ]
    },
    { exerciseName: "Overhead Press",
      setLog: [
        {weight: 27.5, sets: 1, reps: 5}
      ]
    }
  ];

// get archive of all workouts (for now)
app.get('/archive', workout_controller.workout_archive_get)

app.get('/workouts/:id', workout_controller.workout_view_get)

// POST a new workout
app.post('/new', workout_controller.workout_create_post);

app.get('/workouts', workout_controller.workouts_get);

app.listen(5000, () =>
{ console.log("server started on port 5000")});