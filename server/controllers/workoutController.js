const WorkoutLog = require('../models/workoutlog');
const SingleExercise = require('../models/singleexercise');
const asyncHandler = require('express-async-handler');
// validation
const { body, validationResult } = require('express-validator');

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

exports.workout_delete_post = asyncHandler(async(req, res) => {
    const workoutID = req.params.id;
    try {
        // Find the workout by ID and remove it
        const deletedWorkout = await WorkoutLog.findByIdAndRemove(workoutID);

        if (!deletedWorkout) {
            // If the workout with the given ID is not found, return an error
            return res.status(404).send("Workout not found");
        }

        // Successfully deleted the workout
        res.status(200).send("Workout deleted successfully");
    } catch (error) {
        // Handle any errors that occur during the deletion process
        console.error("Error deleting workout:", error);
        res.status(500).send("Error deleting workout");
    }
});

exports.workout_update_post = [
    // validate and sanitize fields
    body("exerciseList.*.setLog.*.weight", "Weight must be a number")
        .trim()
        .isNumeric()
        .isLength({ min: 1, max: 6 })
        .escape(),
    body("exerciseList.*.setLog.*.sets", "Sets must be a whole positive number")
        .trim()
        .isInt({ min: 1 })
        .isLength({ min: 1, max: 6 })
        .escape(),
    body("exerciseList.*.setLog.*.reps", "Reps must be a whole positive number")
        .trim()
        .isInt({ min: 1 })
        .isLength({ min: 1, max: 6 })
        .escape(),

    asyncHandler(async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                const errorArray = errors.array();
                const uniqueErrorMessages = [...new Set(errorArray.map(error => error.msg))];
                return res.status(400).json({
                    success: false,
                    message: 'Validation errors',
                    validationErrors: uniqueErrorMessages,
                });
            }
            // if we are here, the errors are empty and it's ok to save :)
            const exerciseList = req.body.exerciseList;
            const workoutID = req.params.id;
        
            const updatedExerciseIDs = [];
        
            for (const exercise of exerciseList) {
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
                        res.status(500).json({
                            success: false,
                            message: 'Error saving new exercise',
                        });
                        return;
                    }
                } else {
                    // If the exercise is not new, update the existing exercise
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

            // update workoutLog with updated exerciseIDs ^^
            await WorkoutLog.findByIdAndUpdate(workoutID, {
                exerciseList: updatedExerciseIDs,
            });

            // check if update successful
            const updatedWorkout = await WorkoutLog.findById(workoutID);

            res.status(200).json({
                success: true,
                message: 'Workout updated successfully',
            });
        } catch (error) {
            console.error('Error updating workout:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error',
            });
        }
    }),
];

exports.workout_archive_get = asyncHandler(async(req, res) => {
    // get all workouts and send their data
    // in an array. :)
    const allWorkouts = await WorkoutLog.find({})
    .sort({ date: -1 })
    .populate("exerciseList")
    .exec();
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
    // validate and sanitize input
    body("exerciseList.*.setLog.*.weight", "Weight must be a number")
        .trim()
        .isNumeric()
        .isLength({ min: 1, max: 6 })
        .escape(),
    body("exerciseList.*.setLog.*.sets", "Sets must be a whole positive number")
        .trim()
        .isInt({ min: 1 })
        .isLength({ min: 1, max: 6 })
        .escape(),
    body("exerciseList.*.setLog.*.reps", "Reps must be a whole positive number")
        .trim()
        .isInt({ min: 1 })
        .isLength({ min: 1, max: 6 })
        .escape(),
    // process request after validation
    asyncHandler(async (req, res) => {
        console.log("this is req.body")
        console.log(JSON.stringify(req.body))
        const errors = validationResult(req);
        const errorArray = errors.array();
        const printErrors = [...new Set(errorArray.map(error => error.msg))];
        if (!errors.isEmpty()) {
            const errorArray = errors.array();
            const uniqueErrorMessages = [...new Set(errorArray.map(error => error.msg))];
            return res.status(400).json({
                success: false,
                message: 'Validation errors',
                validationErrors: uniqueErrorMessages,
            });
        } else {
            try {
            // no errors in input, can save to database :)
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
            
            const workoutID = workoutLog._id;

            // save exercise logs
            await SingleExercise.insertMany(exerciseObjectList);
            // save workout log
            await WorkoutLog.create(workoutLog);

            res.status(200).json({
                success: true,
                message: 'Workout saved successfully',
            });
        } catch (error) {
            // error saving to database ~ DB problem
            success: false,
            console.error('Error saving workout:', error);
            res.status(500).json({
            message: 'Internal server error',
        });
        }
        }
        }),
];