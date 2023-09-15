const express = require('express');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
const cors = require('cors');
app.use(cors());
const helmet = require('helmet');
// rate limiter
const RateLimit = require("express-rate-limit");
// limit all requests to 20 per minute.
const limiter = RateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 20,
});
// Apply rate limiter to all requests
app.use(limiter);
// controller
const workout_controller =
require('./controllers/workoutController');
// db stuff
// connect to database
const dotenv = require("dotenv").config();
const mongoDB = process.env.MONGODB;
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      "script-src": ["'self'", "code.jquery.com", "cdn.jsdelivr.net"],
    },
  }),
);

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

// update an existing workout in database
app.post('/workouts/:id/update', workout_controller.workout_update_post);

app.get('/workouts', workout_controller.workouts_get);

app.post('/workouts/:id/delete', workout_controller.workout_delete_post);

app.listen(5000, () =>
{ console.log("server started on port 5000")});