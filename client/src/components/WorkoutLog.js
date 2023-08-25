import React, { useState, useEffect } from 'react';
import SingleExercise from './SingleExercise';
import { v4 as uuidv4 } from 'uuid';

// create a workout log, which is a list of single exercises,
// each of which in turn has a list of sets
function WorkoutLog(props) {
    // create an empty exercise with a single empty set.
    const emptyExercise = {
        id: null,
        exerciseName: 'Squat',
        setLog: [
        {id: null, weight: null, sets: null, reps: null},
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

    useEffect(() => {
        if (props.isPrefilled) {
            setExerciseList(props.data);
        }
    });
    // }, []);

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

    // user clicks 'Add a new exercise', create new empty guy.
    function handleAddingExercise(e) {
        e.preventDefault();
        const newExerciseList =
        currentExerciseList.concat(createEmptyExerciseWithId());
        // add a new empty exercise to the list... then we
        // somehow need to update him, as well.
        setExerciseList(newExerciseList);
    }

    // handle submit of workout: for now, this is for a NEW
    // workout. we have to post the data to the DB.
    // we'll do that in App.js
    const handleSubmit = async (e) => {
        e.preventDefault();
        // I don't want to send my react id's to my server.
        // let's delete them.
        const exerciseListToSend = currentExerciseList.map(
            (exercise) => {
                // go over setList and copy without id
                const setLog = exercise.setLog.map(
                    (set) => {
                        return {
                            weight: set.weight,
                            sets: set.sets,
                            reps: set.reps,
                        }
                    }
                )
                return {
                    exerciseName: exercise.exerciseName,
                    setLog: setLog,
                }
            }
        )
        // removed react id's
        const workoutLogToSend = {
            user_id: 0,
            exerciseList: exerciseListToSend,
        }
        await props.handleWorkoutSubmit(true, workoutLogToSend);

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
                    />
                </li>
                ))}
                <button
                className="btn btn-add-exercise single-exercise"
                onClick={handleAddingExercise}>
                    Add Another Exercise
                </button>
            </ul>
            <button
            className="btn btn-submit-workout"
            type="submit">
                Save Workout
            </button>
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
                className="btn">
                    Edit Workout
                </button>
                <button
                className="btn">
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