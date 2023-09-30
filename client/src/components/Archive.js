import React, { useState, useEffect } from 'react';
import WorkoutLog from './WorkoutLog';

function Archive(props) {
    // problem: doesn't get the right token.
    // token comes from App from PrivateRoute.
    // let's print them all and see what's going on.
    // alert("from Archive: token value is " + props.token)

    const [exerciseName, setExerciseName] = useState('');
    const [dateRange, setDateRange] = useState('');
    // const [showWorkoutsWithPRs, setShowWorkoutsWithPRs] = useState(false);

    // get list of workouts from backend with optional filter
    const [backendData, setBackendData] = useState([]);

    const [workoutList, setWorkoutList] = useState([]);

    const backendUrl = process.env.REACT_APP_BACKEND_URL;
    
    useEffect(() => {
        const user_id = props.userID;
    
        fetch(`${backendUrl}/workouts?exercise_name=${exerciseName}&date_range=${dateRange}`, {
            method: 'GET',
            headers: {
                'User-ID': user_id,
                'Authorization': `Bearer ${props.token}`,
            },
        })
        .then(response => response.json())
        .then(data => {
            // Modify the fetched data to include 'inputError' field
            const modifiedData = data.map(workout => ({
                ...workout,
                exerciseList: workout.exerciseList.map(exercise => ({
                    ...exercise,
                    setLog: exercise.setLog.map(singleSet => ({
                        ...singleSet,
                        inputErrors: false,
                    })),
                })),
            }));
            setBackendData(modifiedData);
        });
    }, [exerciseName, dateRange, props.workoutDeletedCount, props.token]);

    // a second useEffect to update my workoutList correctly
    useEffect(() => {
        const workoutLogList = backendData.map((workoutData) => ({
          workoutID: workoutData.id,
          workoutDate: workoutData.date,
          workoutExerciseList: workoutData.exerciseList,
          hasBeenClicked: false,
          isEditing: false,
        }));

        setWorkoutList(workoutLogList);
        // Update the workoutList state
      }, [backendData]);

    // change workoutLog to editing when user edits it
    function handleWorkoutEdit(id) {
        const changedWorkoutList = workoutList?.map((workout) => {
            if (workout.workoutID === id) {
                return {...workout,
                    isEditing: true}
            }
            return workout;
        })
        setWorkoutList(changedWorkoutList);
    }

    function finishWorkoutEditing(id, workoutLogToSend) {
        // change this workout's is Editing back to false
        // and set its new data (though he could do it itself...)
        const changedWorkoutList = workoutList?.map((workout) => {
            if (workout.workoutID === id) {
                return {...workout,
                    isEditing: false,
                    data: workoutLogToSend}
            }
            return workout;
        })
        setWorkoutList(changedWorkoutList);
    }


    function onClickDisplayOrHideWorkout(id) {
        const changedWorkoutList = workoutList?.map((workout) => {
            if (workout.workoutID === id) {
                return {...workout,
                    hasBeenClicked: !workout.hasBeenClicked}
            }
            return workout;
        })
        setWorkoutList(changedWorkoutList);
    }

    function exerciseSelect(e) {
        e.preventDefault();
        // set exercise name state to the selected value
        setExerciseName(e.target.value);
    }

    function dateSelect(e) {
        e.preventDefault();
        setDateRange(e.target.value);
    }

    return (
        <div>
            <div className="workout-filters">
                <div className="filter-group">
                    <label htmlFor="exercises">Display workouts containing:</label>
                    <select
                    className="dropdown-menu"
                    id="exercises"
                    onChange={exerciseSelect}
                    >
                    <option value="All Exercises">All Exercises</option>
                    <option value="Squat">Squat</option>
                    <option value="Bench Press">Bench Press</option>
                    <option value="Overhead Press">Overhead Press</option>
                    <option value="Deadlift">Deadlift</option>
                    <option value="Power Clean">Power Clean</option>
                    </select>
                </div>

                <div className="filter-group">
                    <label htmlFor="date">Show workouts from:</label>
                    <select
                    className="dropdown-menu"
                    id="date"
                    onChange={dateSelect}>
                    <option value="past-30-days">Past 30 days</option>
                    <option value="past-3-months">Last 3 months</option>
                    <option value="2023">2023</option>
                    <option value="all-time">All Time</option>
                    </select>
                </div>
            </div>
            <ul>
                {workoutList.map((workout) =>
                <li key={workout.workoutID}>
                    <div>
                        <button
                        className="btn"
                        onClick={() => onClickDisplayOrHideWorkout(workout.workoutID)}>
                            {workout.workoutDate}
                        </button>
                        { workout.hasBeenClicked &&
                        <WorkoutLog
                        workoutLogIsNew={false}
                        id={workout.workoutID}
                        isEditing={workout.isEditing}
                        isPrefilled={true}
                        data={workout.workoutExerciseList}
                        handleWorkoutSubmit={props.handleWorkoutSubmit}
                        handleWorkoutEdit={handleWorkoutEdit}
                        finishWorkoutEditing={finishWorkoutEditing}
                        handleWorkoutUpdate={props.handleWorkoutUpdate}
                        handleWorkoutDeletion={props.handleWorkoutDeletion}/>
                        }
                    </div>
                </li>
                )}
            </ul>
        </div>
    )
}

export default Archive;