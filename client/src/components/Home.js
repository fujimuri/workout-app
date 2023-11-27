import React, { useState, useEffect } from 'react';
import app from '../firebase';
import {
    getAuth,
    onAuthStateChanged,
} from 'firebase/auth';

function Home(props) {

    const auth = getAuth(app);
    const [user, setUser] = useState(null);
    const [initialCheckDone, setInitialCheckDone] = useState(false); // Added initialCheckDone state

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          setUser(user);
          setInitialCheckDone(true); // Mark initial check as done
        });
    
        return () => unsubscribe();
      }, [auth]);

    if (!initialCheckDone) {
        return null;
    }

    return (
        <div className="workout-log">
            {
                user ?
                (
                    <h3>
                        Welcome back, {user.email}!
                    </h3>
                ) : (
                    <h3>
                        Welcome!
                    </h3>
                )
            }
            <p>
                Here you can easily track your workouts.
            </p>
            <div>
                {
                    user ? (
                        <p>
                            We hope you're enjoying the app so far.
                        </p>
                    ) : (
                        <p>
                            Please <a href="/login">sign up</a> to be able to log your own workouts!
                        </p>
                    )
                }
                <p>
                    Happy lifting! 🍓
                </p>
                <img src={process.env.PUBLIC_URL + '/images/pikachu-workout.jpg'} alt="Pikachu" />
            </div>
        </div>
    )
}

export default Home;