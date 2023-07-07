const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors());

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

app.get("/workouts/:id", (req, res) => {
    res.json(DATA)
})

app.listen(5000, () =>
{ console.log("server started on port 5000")});