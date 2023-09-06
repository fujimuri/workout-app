import React, { useState, useEffect } from 'react';
import SingleExercise from './SingleExercise';
import { v4 as uuidv4 } from 'uuid';

// create a workout log, which is a list of single exercises,
// each of which in turn has a list of sets
function WorkoutLog(props) {
    // create an empty exercise with a single empty set.
    const emptyExercise = {
        isNew: true, // tells the DB whether to generate a new
        // object for this singleExercise or not :3
        id: null,
        exerciseName: 'Squat',
        setLog: [
        {isNew: true, id: null, weight: null, sets: null, reps: null},
      ]
    }

    function createEmptyExerciseWithId() {
        const newExercise = emptyExercise;
        // each SingleExercise has id
        const newExerciseId = uuidv4();
        const newSetId = uuidv4();
        newExercise.id = newExerciseId;
        newExercise.setLog[0].id = newSetId;
        return newExercise;
    }

    const initialExerciseList = props.isPrefilled? props.data :
    [createEmptyExerciseWithId()];
    
    const [currentExerciseList, setExerciseList] =
    useState(initialExerciseList);
    // above is relevant to edit mode, not view mode. :)

    // when does WorkoutLog update itself?
    useEffect(() => {
        if (props.isPrefilled) {
            setExerciseList(props.data);
        }
    }, [props.data, props.isPrefilled]);

    // exercise with id sends change its name and setlog once
    // one of them has been changed, we update them.
    function handleExerciseChange(id, changedExerciseName, 
        changedExerciseSetLog) {
        const editedExerciseList =
        currentExerciseList.map((exercise) =>
        {
            if (id === exercise.id) {
                return { ...exercise,
                    exerciseName: changedExerciseName,
                    setLog: changedExerciseSetLog};
            }
            return exercise;
        });
        setExerciseList(editedExerciseList);
    }

    // delete exercise with given id
    function handleExerciseDeletion(idToDelete) {
        const editedExerciseList =
        currentExerciseList.filter(
            (exercise) => exercise.id !== idToDelete);
        setExerciseList(editedExerciseList);
    }

    // user clicks 'Add a new exercise', create new empty guy.
    function handleAddingExercise(e) {
        e.preventDefault();
        const newExerciseList =
        currentExerciseList.concat(createEmptyExerciseWithId());
        // add a new empty exercise to the list... then we
        // somehow need to update him, as well.
        setExerciseList(newExerciseList);
    }

    const handleEdit = async (e) => {
        e.preventDefault();
        // tell Archive that this workoutLog is being edited,
        // which will reload this component
        props.handleWorkoutEdit(props.id);
    }

    const handleDelete = async (e) => {
        e.preventDefault();
        // delete this WorkoutLog in the database.
        // So App should have this function. :)
        props.handleWorkoutDeletion(props.id);
    }

    // handle submit of workout: for now, this is for a NEW
    // workout. we have to post the data to the DB.
    // we'll do that in App.js
    const handleSubmit = async (e) => {
        e.preventDefault();
        // if the SingleExercise exists, I want to send its
        // id back to the server. If it doesn't and
        // was added, I have to generate a new ExerciseLog
        // for it on my backend.
        const exerciseListToSend = currentExerciseList.map(
            (exercise) => {
                // I don't need to reset id anymore!
                // const setLog = exercise.setLog.map(
                //     (set) => {
                //         return {
                //             weight: set.weight,
                //             sets: set.sets,
                //             reps: set.reps,
                //         }
                //     }
                // )
                // alert("exercise.isNew is" + exercise.isNew);
                // alert("exercise's setLog is:")
                // alert(JSON.stringify(exercise.setLog))
                return {
                    isNew: exercise.isNew,
                    id: exercise.id, // if exercise not new, then
                    // this id is from DB. else, we ignore it.
                    exerciseName: exercise.exerciseName,
                    setLog: exercise.setLog,
                }
            }
        )
        // removed react id's
        const workoutLogToSend = {
            user_id: 0,
            exerciseList: exerciseListToSend,
        }
        // workout submit or workout update?
        // changing to workout update for now!
        if (props.workoutLogIsNew) {
            alert("saving new workout!")
            await props.handleWorkoutSubmit(workoutLogToSend);
        } else {
            // updating existing workout
            await props.handleWorkoutUpdate(props.id, workoutLogToSend);
            // tell Archive this WorkoutLog was submitted
            props.finishWorkoutEditing(props.id, workoutLogToSend);
        }
    }

    const editingTemplate = (
        <div className="workout-log workout-log-edit">
        <form onSubmit={handleSubmit}>
            <h3> Add an exercise, weight and sets x reps: </h3>
            <ul className="list-of-exercises">
                {currentExerciseList?.map((exercise) => (
                <li className="single-exercise" key={exercise.id}>
                    <SingleExercise
                    id={exercise.id}
                    isPrefilled={props.isPrefilled}
                    isEditing={true}
                    exerciseName={exercise.exerciseName}
                    setLog={exercise.setLog}
                    handleExerciseChange={handleExerciseChange}
                    handleExerciseDeletion={handleExerciseDeletion}
                    />
                </li>
                ))}
                <button
                className="btn btn-add-exercise single-exercise"
                onClick={handleAddingExercise}>
                    + Add Exercise
                </button>
            </ul>
            <button
            className="btn btn-submit-workout"
            type="submit">
                Save Workout
            </button>
            {props.isPrefilled && (
            <button
            onClick={handleDelete}
            className="btn btn-submit-workout"
            type="submit">
                Delete Workout
            </button>
            )}
        </form>
        </div>
    )
    

    const viewTemplate = (
        <div className="workout-log workout-log-view">
            <ul className="list-of-exercises">
                {currentExerciseList?.map((exercise) => (
                    <li className="single-exercise" key={exercise.id}>
                        <SingleExercise
                        isPrefilled={props.isPrefilled}
                        isEditing={false}
                        exerciseName={exercise.exerciseName}
                        setLog={exercise.setLog}
                        />
                    </li>
                ))}
                <button
                onClick={handleEdit}
                className="btn btn-submit-workout">
                    Edit Workout
                </button>
                <button
                onClick={handleDelete}
                className="btn btn-submit-workout">
                    Delete Workout
                </button>
            </ul>
        </div>
    )

    return (
        props.isEditing? editingTemplate : viewTemplate
    )
}

export default WorkoutLog;