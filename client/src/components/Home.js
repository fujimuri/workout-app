import React, { useState, useEffect } from 'react';

function Home(props) {

    return (
        <div className="workout-log">
            <h3>
                Welcome!
            </h3>
            <div>
                <p>
                    Here you can easily track your strength workouts.
                </p>
                <p>
                    Please <a href="/login">sign up</a> to be able to log your own workouts!
                </p>
                <p>
                    Happy lifting! 🍓
                </p>
                <img src={process.env.PUBLIC_URL + '/images/pikachu-workout.jpg'} alt="Pikachu" />
            </div>
        </div>
    )
}

export default Home;