import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import app from '../firebase'; // Import the Firebase app instance
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import App from '../App'

function PrivateRoute(props) {
    // debugging token
    const auth = getAuth(app);

    const [user, setUser] = useState(null);
    const [initialCheckDone, setInitialCheckDone] = useState(false);
    const [token, setToken] = useState(null);

    useEffect(() => {
        // Check if a user is logged in
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                // user is signed in. set user.
                setUser(user);
                // get user's token
                user.getIdToken(/* forceRefresh */ true)
                .then(idToken => {
                setToken(idToken);
                // alert("fromPrivateRoute, useEffect: token is " + idToken)
                })
                .catch(error => {
                // error in getting token
                console.error('Error getting ID token:', error);
                });
            } else {
                // user is not signed in
                setUser(null);
            }
            // set initial check done
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
        token={token}
        />
      ) : (
        <Navigate to="/login" replace />
      );
    }

export default PrivateRoute;