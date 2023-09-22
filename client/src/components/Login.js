import React, { useState } from 'react';
import app from '../firebase';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

function Login() {
    const auth = getAuth(app);


    // const user = await createUserWithEmailAndPassword(auth, email, password)
    // .then((userCredential) => {
    //   // Signed in 
    //   const user = userCredential.user;
    //   // ...
    // })
    // .catch((error) => {
    //   const errorCode = error.code;
    //   const errorMessage = error.message;
    //   // ..
    // });

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    const register = async (e) => {
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

        }
    }

    function handleEmailChange(e) {
        e.preventDefault();
        setEmail(e.target.value);
    }

    function handlePasswordChange(e) {
        e.preventDefault();
        setPassword(e.target.value);
    }


    return (
        <div>
            <h3>Register a New User</h3>
            <form className="login-form" onSubmit={register}>
                <input
                id="email"
                type="email"
                value={email}
                onChange={handleEmailChange}
                required/>
                <label>Email</label>
                <input
                id="password"
                type="password"
                value={password}
                onChange={handlePasswordChange}
                required/>
                <label>Password</label>
                <button type="submit">
                    Sign Up
                </button>
            </form>
        </div>
    )
}

export default Login;