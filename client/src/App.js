import React, { useEffect, useState } from 'react';
import WorkoutLog from './components/WorkoutLog'
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import Header from './components/Header';
import Archive from './components/Archive';

function App(props) {

  const navigate = useNavigate();

  const isEditing = props.isEditing;
  const isPrefilled = props.isPrefilled;
  console.log("isEditing is " + isEditing);
  console.log("isPrefilled is " + isPrefilled);

  // id of workout that we get from url workouts/:id
  const { id } = useParams();

  const [backendData, setBackendData] = useState([{}]);

  // fetch data for a specific workout: I use this for
  // workouts/:id/view or edit page, however soon I'm going
  // to replace that with my archive page anyway. <3
  useEffect(() => {
    if (isPrefilled) {
      console.log("fetching data for workout log!");
      fetch(`http://localhost:5000/workouts/${id}`).then(
      response => response.json()
    ).then(
      data => setBackendData(data)
    )
    }
  }, [isEditing, setBackendData]);

  const handleWorkoutSubmit = async (isNew, workoutLog) => {
    if (isNew) {
      console.log("saving my new workout");
      await fetch('http://localhost:5000/new', {
            method: 'POST',
            body: JSON.stringify(workoutLog),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(
          response => response.json()
        ).then(
          data => navigate(`/workouts/${data}/view`)
        )
    }
  };

  return (
    <div>
      <Header pageName={props.pageName}/>
      {
        props.pageName === "Previous Workouts" ? (
          <Archive
          isEditing={false}
          isPrefilled={true}
          handleWorkoutSubmit={handleWorkoutSubmit}/>
        ) : (
          <WorkoutLog
          isEditing={isEditing}
          isPrefilled={isPrefilled}
          data={backendData}
          handleWorkoutSubmit={handleWorkoutSubmit}/>
        )
      }
    </div>
  );
}

export default App;