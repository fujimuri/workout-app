import React, { useEffect, useState } from 'react';

// a component to display a workout log with a given id.
function WorkoutLogPreview(props) {
    const workoutID = props.id;
    // get workout data from backend
    const [workoutData, setWorkoutData] = useState([{}]);
    // fetch data from backend
    useEffect(() => {
        fetch(`http://localhost:5000/workouts/${workoutID}`).then(
        response => response.json()
        ).then(
        data => setWorkoutData(data)
        )
    }, [setWorkoutData]);
    // display workout data

    return (
        <div className="workout-log-preview">
            <ul className="list-of-exercises">
                {workoutData?.map((exercise) => (
                    <li className="single-exercise">
                        <b>
                            {exercise.exerciseName}
                        </b>
                        <ul className="list-of-sets">
                        {exercise.setLog?.map((set) => (
                            <li>
                                <div>
                                    {set.weight} kg {set.sets} sets x {set.reps} reps
                                </div>
                            </li>
                        ))}
                        </ul>
                    </li>
                ))}
            </ul>
        </div>
    )
}



export default WorkoutLogPreview;