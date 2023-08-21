import React from 'react';
import './Header.css';
import { Link } from 'react-router-dom';

function Header() {
    // component that displays the application name and links
    // to navigate.
    // front page: page with default new workout.
    // can navigate to: previous workouts, personal bests,
    // hall of fame (display PRs across all users
    const namesAndLinks = [
        {
            urlName: 'Previous Workouts',
            url: 'http://localhost:3000/workouts'
        },
        {
            urlName: 'Personal Bests',
            url: 'http://localhost:3000/workouts'
        },
        {
            urlName: 'Hall of Fame',
            url: 'http://localhost:3000/workouts'
        },
    ]
    return (
        <div className="header">
            <h1 className="header-title">
                Workout Tracking App
            </h1>
            <ul className="header-links">
                {namesAndLinks.map((obj) => (
                    <li className="header-links">
                        <Link to={obj.url}>{obj.urlName}</Link>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default Header;