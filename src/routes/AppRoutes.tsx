import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from '../components/Auth/Login';
import Register from '../components/Auth/Register';

const AppRoutes: React.FC = () => {
    return(
        <Router>
            <Routes>
                <Route
                    path='/'
                    element={<Login />}
                ></Route>
                <Route
                    path='/register'
                    element={<Register />}
                ></Route>
            </Routes>
        </Router>
    )
}

export default AppRoutes;