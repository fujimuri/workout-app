import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import app from '../firebase'; // Import the Firebase app instance
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import App from '../App'

function PrivateRoute(props) {

    const auth = getAuth(app);

    const [user, setUser] = useState(null);
    const [initialCheckDone, setInitialCheckDone] = useState(false);
    const [token, setToken] = useState(null);

    useEffect(() => {
        // Check if a user is logged in
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                // User is signed in.
                setUser(user);
                // get token
                user.getIdToken(/* forceRefresh */ true)
                .then(idToken => {
                setToken(idToken);
                // alert("from PrivateRoute: token value is " + token)
                // alert("from PrivateRoute: idToken value is " + idToken)
                // Now you can use the token as needed.
                })
                .catch(error => {
                // Handle any errors that occur while getting the token.
                console.error('Error getting ID token:', error);
                });
            } else {
                // No user is signed in.
                setUser(null);
            }
            // Mark initial check as done
            setInitialCheckDone(true);
        });
        // Cleanup the subscription when the component unmounts
        return () => unsubscribe();
    }, [auth]);

    if (!initialCheckDone) {
        // Authentication state is being determined, don't redirect
        return null;
    }

    return user ? (
        <App
        isEditing={props.isEditing}
        isPrefilled={props.isPrefilled}
        pageName={props.pageName}
        userID={user.uid}
        token={token}/>
      ) : (
        <Navigate to="/login" replace />
      );
    }

export default PrivateRoute;