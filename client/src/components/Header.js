import React from 'react';
import './Header.css';
import { Link } from 'react-router-dom';

function Header(props) {
    // component that displays the application name and links
    // to navigate.
    // I want to highlight the page where we are currently. So
    // we need to know which page we're on.
    const pageName = props.pageName;

    const namesAndLinks = [
        {
            urlName: 'New Workout',
            url: '/new' // might be /new later
        },
        {
            urlName: 'Previous Workouts',
            url: '/workouts'
        },
        {
            urlName: 'Personal Bests',
            url: '/workouts/personal-bests'
        },
        {
            urlName: 'Hall of Fame',
            url: '/workouts/hall-of-fame'
        },
    ]

    return (
        <div className="header">
            <h1 className="header-title">
                <a className="header-link" href="/">
                    Workout Tracking App
                </a>
            </h1>
            <ul className="header-links">
                {namesAndLinks.map((obj) => (
                    <li className="header-link">
                        <button className={pageName === obj.urlName? 'header-link-btn-active' : 'header-link-btn'}>
                            <Link
                                to={obj.url}
                                className={pageName === obj.urlName? 'link-active' : 'link'}
                                >
                                    {obj.urlName}
                            </Link>
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default Header;