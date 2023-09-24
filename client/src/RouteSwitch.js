import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import Login from './components/Login'
import PrivateRoute from './components/PrivateRoute';

const RouteSwitch = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route
                path="/"
                element={
                        <PrivateRoute
                        isEditing={true}
                        isPrefilled={false}
                        pageName="New Workout"
                        />
                }/>
                <Route
                path="/new"
                element={
                        <PrivateRoute
                        isEditing={true}
                        isPrefilled={false}
                        pageName="New Workout"
                        />
                }/>
                <Route
                path="/workouts"
                element={
                        <PrivateRoute
                        pageName="Previous Workouts"
                        />
                }/>
                <Route
                path="/workouts/personal-bests"
                element={
                        <PrivateRoute
                        pageName="Personal Bests"
                        />
                }/>
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