import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import app from '../firebase'; // Import the Firebase app instance
import { getAuth, onAuthStateChanged } from 'firebase/auth';

function PrivateRoute({ element }) {

    const auth = getAuth(app);

    const [user, setUser] = useState(null);
    const [initialCheckDone, setInitialCheckDone] = useState(false);

    useEffect(() => {
        // Check if a user is logged in
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                // User is signed in.
                setUser(user);
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
        element
      ) : (
        <Navigate to="/login" replace />
      );
    }

export default PrivateRoute;