import './Header.css';
import React, { useState, useEffect } from 'react';
import app from '../firebase';
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
  } from 'firebase/auth';
  import { useNavigate } from 'react-router-dom';


function Login() {
    const navigate = useNavigate();

    const auth = getAuth(app);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);
    const [initialCheckDone, setInitialCheckDone] = useState(false); // Added initialCheckDone state

    // useEffect(() => {
    //     // Check if a user is already logged in
    //     onAuthStateChanged(auth, (user) => {
    //       if (user) {
    //         // User is signed in.
    //         setUser(user);
    //       } else {
    //         // No user is signed in.
    //         setUser(null);
    //       }
    //     });
    // }, [auth]);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          setUser(user);
          setInitialCheckDone(true); // Mark initial check as done
        });
    
        return () => unsubscribe();
      }, [auth]);

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const user = await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );
            console.log(user);
        } catch (error) {
            console.log(error.message);
            alert("theres an error" + error.message)
            setError(error.message)
        }
        navigate('/new');
    }

    function handleEmailChange(e) {
        e.preventDefault();
        setEmail(e.target.value);
    }

    function handlePasswordChange(e) {
        e.preventDefault();
        setPassword(e.target.value);
    }

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
        await signInWithEmailAndPassword(auth, email, password);
        setError(null);
        } catch (error) {
        setError(error.message);
        }
        navigate('/new');
    };

    const handleLogout = async () => {
        try {
        await signOut(auth);
        setUser(null);
        setEmail('');
        setPassword('');
        setError(null);
        } catch (error) {
        setError(error.message);
        }
    };

    if (!initialCheckDone) {
        return null; // You can use a loading indicator here if needed
    }

    return (
        <div>
            <div className="header">
                <h1 className="header-title">
                    Workout Tracking App
                </h1>
            </div>
            <div>
            {user ? (
            <div className="user-logged-in">
              <p>Hello, {user.email}. You're already logged in.</p>
              <button
              className="btn go-back-btn"
              onClick={() => navigate('/new')}>
                Go Back to Workout App</button>
                <button
              className="btn logout-btn"
              onClick={handleLogout}>
                Log Out
                </button>
            </div>
          ) : (
            <div>
              <p className="login-text">
                Log in for an existing user or sign up for a new user:
                </p>
              <form className="login-form" onSubmit={handleLogin}>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  required
                />
                <label>Email</label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={handlePasswordChange}
                  required
                />
                <label>Password</label>
                <div>
                    <button
                    className="btn login-btn"
                    type="submit"
                    onClick={handleLogin}>
                        Log In
                    </button>
                    <button
                    className="btn signup-btn"
                    type="submit"
                    onClick={handleRegister}>
                        Sign Up
                    </button>
                </div>
                {error && <p>{error}</p>}
              </form>
            </div>
          )}
            </div>
        </div>
      );
}

export default Login;