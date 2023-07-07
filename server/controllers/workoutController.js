const WorkoutLog = require('../models/workoutlog');
const SingleExercise = require('../models/singleexercise');
const asyncHandler = require('express-async-handler');
// validation
const { body, validationResult } = require('express-validator');

// helper function :)
async function findWorkoutsContainingExercise (exerciseName) {
    const singleExercisesFiltered =
    await SingleExercise.find({ exerciseName: exerciseName });

    const filteredWorkoutLogs = await WorkoutLog.find({
        exerciseList:
        { $in: singleExercisesFiltered.map(
            (singleExercise) => singleExercise._id)
        }
    }).populate("exerciseList").sort({ date: 1 }).exec();
    return filteredWorkoutLogs;
}

exports.workouts_get = asyncHandler(async(req, res) => {
    // Get filter parameters from the query string
    const exerciseName = req.query.exercise_name;
    const dateRange = req.query.date_range;
    const containsPR = req.query.contains_pr === true;

    let query = {}; // Initialize the query object for the MongoDB query

    if (exerciseName && exerciseName !== 'All Exercises') {
        const singleExercisesFiltered = await SingleExercise.find({
        exerciseName: exerciseName,
        }).select('_id');

        query = {
        ...query,
        exerciseList: { $in: singleExercisesFiltered.map((exercise) => exercise._id) },
        };
    }

    // Filter based on date_range
    if (dateRange && dateRange !== "all-time") {
        if (dateRange === 'past-30-days') {
          const startDate = new Date();
          startDate.setDate(startDate.getDate() - 30);
          query.date = { $gte: startDate };
        } else if (dateRange === 'past-3-months') {
          const startDate = new Date();
          startDate.setMonth(startDate.getMonth() - 3);
          query.date = { $gte: startDate };
        } else if (dateRange === '2023') {
          const startDate = new Date('2023-01-01');
          const endDate = new Date('2023-12-31');
          query.date = { $gte: startDate, $lte: endDate };
        }
    }

    console.log("PRINTING MY QUERY HENLO" + JSON.stringify(query));
    const workoutLogs = await WorkoutLog.find(query).sort({ date: -1 }).exec();
    
    // send workouts id, data, and setLog to my frontend :)
    const allWorkoutsIDsAndDatesToSend =
    workoutLogs.map(
        (workout) => (
            {
                id: workout._id,
                date: workout.date_formatted
            }
        )
    )
    console.log(JSON.stringify(allWorkoutsIDsAndDatesToSend));
    res.json(allWorkoutsIDsAndDatesToSend);
});

exports.workout_archive_get = asyncHandler(async(req, res) => {
    // get all workouts and send their {id, date}
    // in an array. :)
    const allWorkouts = await WorkoutLog.find({})
    .sort({ date: -1 })
    .exec();
    console.log(JSON.stringify(allWorkouts))
    // get id's as strings and format date nicely
    const allWorkoutsIDsAndDatesToSend =
    allWorkouts.map(
        (workout) => (
            {
                id: workout._id,
                date: workout.date_formatted
            }
        )
    )
    console.log(JSON.stringify(allWorkoutsIDsAndDatesToSend));
    res.json(allWorkoutsIDsAndDatesToSend);
})

// display workout data with given id
exports.workout_view_get = asyncHandler(async(req, res) => {
    console.log("this is params.id " + req.params.id);
    const workoutExerciseList = await WorkoutLog.findById(req.params.id)
    .populate("exerciseList")
    .select({ exerciseList: 1, _id: 0 });
    const exerciseListData = workoutExerciseList.exerciseList;
    console.log("printing to view my exercise list");
    console.log(JSON.stringify(workoutExerciseList));
    console.log(JSON.stringify(exerciseListData));
    res.json(exerciseListData);
});

// handle a new workout create on POST.
exports.workout_create_post = [
    // validate input
    body("exerciseList.*.setLog.*.*")
    .trim()
    .isNumeric(),
    // process request after validation
    asyncHandler(async (req, res) => {
        const errors = validationResult(req);
        // create a list of SingleExercises: that's our
        // exerciseList.
        const exerciseObjectList = (req.body.exerciseList).map(
            (exerciseLog) => new SingleExercise({
              exerciseName: exerciseLog.exerciseName,
              setLog: exerciseLog.setLog,
            }));
        // create my WorkoutLog
        // we should add date here, not receive it from front!
        const workoutLog = new WorkoutLog({
            
            // date: req.body.date,
            user_id: req.body.user_id,
            exerciseList: exerciseObjectList,
        });

        console.log(JSON.stringify(exerciseObjectList));
        console.log("logging my new workout Log... ")
        console.log(JSON.stringify(workoutLog));
        
        const workoutID = workoutLog._id;

        if (!errors.isEmpty()) {
            // todo
            return;
        } else {
            // save exercise logs
            await SingleExercise.insertMany(exerciseObjectList);
            // save workout log
            await WorkoutLog.create(workoutLog);
            // check that they've been saved, maybe?..
            // redirect, todo
            // send id of created workoutlog :)
            console.log(JSON.stringify(workoutID));
            res.send(JSON.stringify(workoutID));
        }
    }),
];