import React, { useState, useEffect } from 'react';
import SingleExercise from './SingleExercise';
import { v4 as uuidv4 } from 'uuid';

// create a workout log, which is a list of single exercises,
// each of which in turn has a list of sets
function WorkoutLog(props) {
    const [errorMessage, setErrorMessage] = useState('');
    // create an empty exercise with a single empty set.
    const emptyExercise = {
        isNew: true, // tells the DB whether to generate a new
        // object for this singleExercise or not :3
        id: null,
        exerciseName: 'Squat',
        setLog: [
        {isNew: true, id: null, weight: null, sets: null,
            reps: null, inputErrors: false,},
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

    const handleSubmit = async (e) => {
        let hasErrors = false;
        let partiallyFilled = false;
        // DB detected errors in submission
        e.preventDefault();
        for (const exercise of currentExerciseList) {
            for (const set of exercise.setLog) {
              if (set.inputErrors) {
                // there is a set with an input error
                hasErrors = true;
                break;
              }
              if ([set.weight, set.sets, set.reps].filter(Boolean).length > 0
              && [set.weight, set.sets, set.reps].filter(Boolean).length < 3) {
                // if some fields are filled but not all
                partiallyFilled = true;
                break;
              }
            }
          }
        
        if (hasErrors || partiallyFilled) {
            if (hasErrors) {
                setErrorMessage(
                    'There are errors in the input. Please fix them before submitting.')
            }
            if (partiallyFilled) {
                setErrorMessage('At least one the sets is partially filled. Please fill or remove the set.')
            }
        } else {
            const exerciseListToSend = currentExerciseList.map((exercise) => {
                const filteredSetLog = exercise.setLog.filter((singleSet) => {
                    return (
                        singleSet.weight !== null
                    );
                    // checking just for weight because I checked
                    // for partially filled set earlier.
                });
            
                return {
                    isNew: exercise.isNew,
                    id: exercise.id, // if exercise not new, then
                    // this id is from DB. else, we ignore it.
                    exerciseName: exercise.exerciseName,
                    setLog: filteredSetLog,
                };
            });

            const workoutLogToSend = {
                user_id: 0,
                exerciseList: exerciseListToSend,
            }

            // workout submit or workout update
            if (props.workoutLogIsNew) {
                const submissionResult =
                await props.handleWorkoutSubmit(workoutLogToSend);
                // check if success?
                if (!submissionResult.success) {
                    // problem with saving!
                    if (submissionResult.status === 400) {
                        setErrorMessage(submissionResult.errorData.join(',\n'));
                    }
                    if (submissionResult.status === 500) {
                        setErrorMessage(
                            'An internal server error occurred while processing your request. Please try again later.'
                        )
                    }
                }
            } else {
                // updating existing workout
                const submissionResult =
                await props.handleWorkoutUpdate(props.id, workoutLogToSend);
                // check if success?
                if (!submissionResult.success) {
                    // problem with saving!
                    if (submissionResult.status === 400) {
                        setErrorMessage(submissionResult.errorData.join(',\n'));
                    }
                    if (submissionResult.status === 500) {
                        setErrorMessage(
                            'An internal server error occurred while processing your request. Please try again later.'
                        )
                    }
                } else {
                    // tell Archive this WorkoutLog was submitted
                    props.finishWorkoutEditing(props.id, workoutLogToSend);
                }
            }
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
            <div className='submit-workout-error-msg'>
                {errorMessage}
            </div>
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