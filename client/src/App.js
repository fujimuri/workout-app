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

  useEffect(() => {
    if (isPrefilled) {
      console.log("fetching data for workout log!");
      fetch(`http://localhost:5000/workouts/${id}`)
        .then((response) => response.json())
        .then((data) => {
          // Iterate through the fetched data and add inputErrors: false
          const dataWithInputErrors = data.map((workout) => ({
            ...workout,
            exerciseList: workout.exerciseList.map((exercise) => ({
              ...exercise,
              setLog: exercise.setLog.map((set) => ({
                ...set,
                inputErrors: false,
              })),
            })),
          }));
          
          setBackendData(dataWithInputErrors);
        });
    }
  }, [isEditing, setBackendData]);

  // deleted workouts state counter
  const [workoutDeletedCount, setWorkoutDeletedCount] = useState(0);

  // handle submit of a new workout :)
  const handleWorkoutSubmit = async (workoutLog) => {
    try {
        const response = await fetch('http://localhost:5000/new', {
            method: 'POST',
            body: JSON.stringify(workoutLog),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (response.ok) {
              navigate('/workouts');
              return {
                success: true,
              }
        } else if (response.status === 400) {
          // validation errors
            console.error('Bad Request: There was a problem with the request data.');
            const responseData = await response.json();
            return {
              success: false,
              status: 400,
              errorData: responseData.validationErrors,
            }
        } else if (response.status === 500) {
            // Handle Internal Server Error (status code 500)
            console.error('Internal Server Error: There was a problem on the server.');
            const responseData = await response.json();
            console.error('Response Data:', responseData);
            return {
              success: false,
              status: 500,
            }
        } else {
            // Handle unexpected errors (status codes other than 400, 500, and not OK)
            console.error('Failed to save workout:', response.statusText);
        }
    } catch (error) {
        // Handle any network or other errors
        console.error('Error saving workout:', error);
    }
  }
  // };
  // // handle submit of a new workout :)
  // const handleWorkoutSubmit = async (workoutLog) => {
  //   try {
  //       const response = await fetch('http://localhost:5000/new', {
  //           method: 'POST',
  //           body: JSON.stringify(workoutLog),
  //           headers: {
  //               'Content-Type': 'application/json'
  //           }
  //       });
  //       if (response.ok) {
  //         const responseData = await response.json();
  //         if (responseData.success) {
  //           navigate('/workouts');
  //       } else {
  //         // check if it's inputErrors or database problem
  //           console.error('Failed to save workout:', response.statusText);
  //       }
  //   } catch (error) {
  //       // Handle any network or other errors
  //       console.error('Error saving workout:', error);
  //   }
  // }};

  const handleWorkoutUpdate = async (workoutID, workoutLog) => {
    await fetch(`http://localhost:5000/workouts/${workoutID}/update`, {
      method: 'POST',
      body: JSON.stringify(workoutLog),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(
      response => {
      if (response.ok) {
        return true
      } else {
        throw new Error('Request failed'); // Handle the error case
      }
    })
  }

  const handleWorkoutDeletion = async (workoutID) => {
    await fetch(`http://localhost:5000/workouts/${workoutID}/delete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(
      response => {
      if (response.ok) {
        return true
      } else {
        throw new Error('Request failed'); // Handle the error case
      }
    })
    setWorkoutDeletedCount((prevCount) => prevCount + 1);
  }

  return (
    <div>
      <Header pageName={props.pageName}/>
      {
        props.pageName === "Previous Workouts" ? (
          <Archive
          isEditing={false}
          isPrefilled={true}
          handleWorkoutSubmit={handleWorkoutSubmit}
          handleWorkoutUpdate={handleWorkoutUpdate}
          handleWorkoutDeletion={handleWorkoutDeletion}
          workoutDeletedCount={workoutDeletedCount}/>
        ) : (
          <WorkoutLog
          workoutLogIsNew={true}
          isEditing={isEditing}
          isPrefilled={isPrefilled}
          data={backendData}
          handleWorkoutSubmit={handleWorkoutSubmit}
          handleWorkoutDeletion={handleWorkoutDeletion}
          />
        )
      }
    </div>
  );
}

export default App;