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

// handle GET on list of workouts
exports.workouts_get = asyncHandler(async(req, res) => {
    // filter params
    const exerciseName = req.query.exercise_name;
    const dateRange = req.query.date_range;
    const containsPR = req.query.contains_pr === true;

    // mongoDB query
    let query = {};

    // apply name filter
    if (exerciseName && exerciseName !== 'All Exercises') {
        const singleExercisesFiltered = await SingleExercise.find({
        exerciseName: exerciseName,
        }).select('_id');
        // find list of id's of SingleExercises that have the
        // exerciseName I am filtering for.
        query = {
        ...query,
        exerciseList: { $in: singleExercisesFiltered.map((exercise) => exercise._id) },
        };
    }

    // apply date filter
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

    // filter based on contains_pr - TODO
    if (containsPR) {
        // then only show workoutLogs where there exists a
        // SingleExercise with max weight relative to the
        // other SingleExercises with same name in the date
        // range.
    }

    const workoutLogs = await WorkoutLog.find(query)
    .populate('exerciseList')
    .sort({ date: -1 })
    .exec();
    
    // prepare workoutLogs to send to frontend
    // const modifiedWorkoutLogs = workoutLogs.map((workout) => {
    //     const modifiedExerciseList = workout.exerciseList.map((singleExercise) => ({
    //       isNew: false,
    //       id: singleExercise._id,
    //       exerciseName: singleExercise.exerciseName,
    //       setLog: singleExercise.setLog,
    //     }));
      
    //     return {
    //       id: workout._id,
    //       date: workout.date_formatted,
    //       exerciseList: modifiedExerciseList,
    //     };
    //   });

    const modifiedWorkoutLogs = workoutLogs.map((workout) => {
        const modifiedExerciseList = workout.exerciseList.map((singleExercise) => {
            const modifiedSetLog = singleExercise.setLog.map((set) => ({
                isNew: false,
                id: set._id,
                weight: set.weight,
                sets: set.sets,
                reps: set.reps,
            }));
    
            return {
                isNew: false,
                id: singleExercise._id,
                exerciseName: singleExercise.exerciseName,
                setLog: modifiedSetLog,
            };
        });
    
        return {
            id: workout._id,
            date: workout.date_formatted,
            exerciseList: modifiedExerciseList,
        };
    });

    res.json(modifiedWorkoutLogs);
});

// update workout with given id
exports.workout_update_post = [
    // validate and sanitize fields
    // TODO

    asyncHandler(async (req, res) => {
        console.log("updating workout...")
        console.log(JSON.stringify(req.body.exerciseList))

        const exerciseList = req.body.exerciseList;
        const workoutID = req.params.id;
    
        const updatedExerciseIDs = [];
    
        for (const exercise of exerciseList) {
            console.log("the set log of current exercise is:");
            console.log(JSON.stringify(exercise.setLog));
            if (exercise.isNew) {
                // Create a new SingleExercise object with the exercise data
                const newExercise = new SingleExercise({
                    exerciseName: exercise.exerciseName,
                    setLog: exercise.setLog,
                });
    
                try {
                    // Save the new exercise to the database
                    const savedExercise = await newExercise.save();
                    // Push the ID of the newly saved exercise to the list
                    updatedExerciseIDs.push(savedExercise._id);
                } catch (error) {
                    // Handle the error if the exercise couldn't be saved
                    console.error("Error saving new exercise:", error);
                    res.status(500).send("Error saving new exercise");
                    return;
                }
            } else {
                // If exercise is not new, update the existing exercise
                await SingleExercise.findByIdAndUpdate(
                    exercise.id,
                    {
                        exerciseName: exercise.exerciseName,
                        setLog: exercise.setLog,
                    }
                );
                updatedExerciseIDs.push(exercise.id);
            }
        }

        console.log("these are the updated exercise ID's")
        console.log(JSON.stringify(updatedExerciseIDs))
    
        // Update the WorkoutLog with the updated exercise IDs
        await WorkoutLog.findByIdAndUpdate(workoutID, {
            exerciseList: updatedExerciseIDs,
        });

        // check saved
        const updatedWorkout = await WorkoutLog.findById(workoutID);

        console.log("saved WorkoutLog is "
        + JSON.stringify(updatedWorkout))
    
        res.status(200).send("WorkoutLog Updated Successfully");
    }),
]  

exports.workout_archive_get = asyncHandler(async(req, res) => {
    // get all workouts and send their data
    // in an array. :)
    const allWorkouts = await WorkoutLog.find({})
    .sort({ date: -1 })
    .populate("exerciseList")
    .exec();
    // get id's as strings and format date nicely
    // const allWorkoutsIDsAndDatesToSend =
    // allWorkouts.map(
    //     (workout) => (
    //         {
    //             id: workout._id,
    //             date: workout.date_formatted
    //         }
    //     )
    // )
    // console.log(JSON.stringify(allWorkoutsIDsAndDatesToSend));
    res.json(allWorkouts);
})

// display workout data with given id
exports.workout_view_get = asyncHandler(async(req, res) => {
    const workoutData = await WorkoutLog.findById(req.params.id)
    .populate("exerciseList")
    // have to go over exerciseList (SingleExercises...)
    const modifiedExerciseList = workoutData.exerciseList.map((singleExercise) => ({
        isNew: false,
        id: singleExercise._id,
        exerciseName: singleExercise.exerciseName,
        setLog: singleExercise.setLog,
    }));
    res.json(modifiedExerciseList);
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