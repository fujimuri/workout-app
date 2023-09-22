import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import Login from './components/Login'

const RouteSwitch = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route
                path="/"
                element={<App
                        isEditing={true}
                        isPrefilled={false}
                        pageName="New Workout"/>}/>
                <Route
                path="/new"
                element={<App
                        isEditing={true}
                        isPrefilled={false}
                        pageName="New Workout"/>}/>
                <Route
                path="/workouts/:id/view"
                element={<App
                        isEditing={false}
                        isPrefilled={true}
                        pageName="other"
                        />}/>
                <Route
                path="/workouts/:id/edit"
                element={<App
                        isEditing={true}
                        isPrefilled={true}
                        pageName="other"
                        />}/>
                <Route
                path="/workouts"
                element={<App
                        pageName="Previous Workouts"
                        />}/>
                <Route
                path="/workouts/personal-bests"
                        element={<App
                        pageName="Personal Bests"/>}
                />
                <Route
                path="/workouts/hall-of-fame"
                        element={<App
                        pageName="Hall of Fame"/>}
                />
                <Route
                path="/login"
                element={<Login/>}/>
            </Routes>
        </BrowserRouter>
    )
};

export default RouteSwitch;