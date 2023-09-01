import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import WorkoutLog from './WorkoutLog';

function Archive(props) {
    
    const [exerciseName, setExerciseName] = useState('');
    const [dateRange, setDateRange] = useState('');
    const [showWorkoutsWithPRs, setShowWorkoutsWithPRs] = useState(false);

    // get list of workouts from backend with optional filter
    const [backendData, setBackendData] = useState([]);

    const [workoutList, setWorkoutList] = useState([]);

    // fetch data from backend/archive
    // should fetch again after saving an edited workout as well
    useEffect(() => {
        fetch(`http://localhost:5000/workouts?exercise_name=${exerciseName}&date_range=${dateRange}&contains_pr=${showWorkoutsWithPRs}`).then(
        response => response.json()
        ).then(
        data => setBackendData(data)
        )
    }, [exerciseName, dateRange, showWorkoutsWithPRs]);

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
    // the question is, will this reload the workout with the new
    // data?


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

                <div className="filter-group">
                    <input type="checkbox" id="prCheckbox"
                            name="prCheckbox"/>
                    <label htmlFor="prCheckbox">Include Workouts with Personal Records (PRs) within the selected time period</label>
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
                        handleWorkoutUpdate={props.handleWorkoutUpdate}/>
                        }
                    </div>
                </li>
                )}
            </ul>
        </div>
    )
}

export default Archive;