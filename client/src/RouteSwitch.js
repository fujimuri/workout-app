import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import Archive from './components/Archive';

const RouteSwitch = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route
                path="/"
                element={<App
                        isEditing={true}
                        isPrefilled={false}/>}/>
                <Route
                path="/new"
                element={<App
                        isEditing={true}
                        isPrefilled={false}/>}/>
                <Route
                path="/workouts/:id/view"
                element={<App
                        isEditing={false}
                        isPrefilled={true}
                        />}/>
                <Route
                path="/workouts/:id/edit"
                element={<App
                        isEditing={true}
                        isPrefilled={true}
                        />}/>
                <Route
                path="/workouts"
                element={<Archive
                        />}/>
            </Routes>
        </BrowserRouter>
    )
};

export default RouteSwitch;