import React, { useState } from 'react';
import WorkoutLog from './components/WorkoutLog'
import { useNavigate } from 'react-router-dom';
import Header from './components/Header';
import Archive from './components/Archive';
import Home from './components/Home';

function App(props) {
  // checking token value
  // alert("from App: token value is " + props.token)

  const userID = props.userID;

  const navigate = useNavigate();

  const isEditing = props.isEditing;
  const isPrefilled = props.isPrefilled;

  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  // deleted workouts state counter
  const [workoutDeletedCount, setWorkoutDeletedCount] = useState(0);

  // handle submit of a new workout :)
  const handleWorkoutSubmit = async (workoutLog) => {
    if (!props.token) {
      return;
    }

    try {
        const response = await fetch(`${backendUrl}/new`, {
            method: 'POST',
            body: JSON.stringify(workoutLog),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${props.token}`,
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
        return {
          success: false,
          status: 500,
        }
    }
  }

  // handle update of existing workout :)
const handleWorkoutUpdate = async (workoutID, workoutLog) => {
  try {
      const response = await fetch(`${backendUrl}/workouts/${workoutID}/update`, {
          method: 'POST',
          body: JSON.stringify(workoutLog),
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${props.token}`,
          }
      });
      
      if (response.ok) {
          return {
              success: true,
          };
      } else if (response.status === 400) {
          // Validation errors
          console.error('Bad Request: There was a problem with the request data.');
          const responseData = await response.json();
          return {
              success: false,
              status: 400,
              errorData: responseData.validationErrors,
          };
      } else if (response.status === 500) {
          // Handle Internal Server Error (status code 500)
          console.error('Internal Server Error: There was a problem on the server.');
          const responseData = await response.json();
          console.error('Response Data:', responseData);
          return {
              success: false,
              status: 500,
          };
      } else {
          // Handle unexpected errors (status codes other than 400, 500, and not OK)
          console.error('Failed to update workout:', response.statusText);
      }
  } catch (error) {
      // Handle any network or other errors
      console.error('Error updating workout:', error);
  }
}

  const handleWorkoutDeletion = async (workoutID) => {
    if (!props.token) {
      return;
    }
    await fetch(`${backendUrl}/workouts/${workoutID}/delete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${props.token}`,
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
      {(() => {
        switch (props.pageName) {
          case "New Workout":
            return (
            <WorkoutLog
            workoutLogIsNew={true}
            isEditing={isEditing}
            isPrefilled={isPrefilled}
            handleWorkoutSubmit={handleWorkoutSubmit}
            handleWorkoutDeletion={handleWorkoutDeletion}
          />
          );
          case "Previous Workouts":
            return (
              <Archive
                handleWorkoutSubmit={handleWorkoutSubmit}
                handleWorkoutUpdate={handleWorkoutUpdate}
                handleWorkoutDeletion={handleWorkoutDeletion}
                workoutDeletedCount={workoutDeletedCount}
                userID={userID}
                token={props.token}
                refreshToken={props.refreshToken}
              />
            );
            case "Personal Bests":
              return (
                <div>
                  This page is under construction. Visit back soon 🌸
                </div>
            );
            case "Hall of Fame":
              return (
                <div>
                  This page is under construction. Visit back soon 🌸
                </div>
            );
            default:
              return (
                <Home
                userID={userID}
                />
          );
        }
      })()}
    </div>
  );
}

export default App;