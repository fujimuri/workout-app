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
                        element={<App
                                isEditing={true}
                                isPrefilled={false}
                                pageName="New Workout"/>}/>
                }/>
                <Route
                path="/new"
                element={
                        <PrivateRoute
                        element={<App
                                isEditing={true}
                                isPrefilled={false}
                                pageName="New Workout"/>}/>
                }/>
                <Route
                path="/workouts"
                element={
                        <PrivateRoute
                        element={<App
                                pageName="Previous Workouts"/>}/>
                }/>
                <Route
                path="/workouts/personal-bests"
                element={
                        <PrivateRoute
                        element={<App
                                pageName="Personal Bests"/>}/>
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