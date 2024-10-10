import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "../components/Auth/Login";
import Register from "../components/Auth/Register";
import { useSelector } from "react-redux";
import { RootState } from "../redux";
import Index from "../views/LandingPage/Index";

const AppRoutes: React.FC = () => {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

  return (
    <>
      <Routes>
        <Route
          path="/login"
          element={!isAuthenticated ? <Login /> : <Navigate to={"/"} />}
        ></Route>
        <Route
          path="/register"
          element={!isAuthenticated ? <Register /> : <Navigate to={"/"} />}
        ></Route>
        <Route
          path="/"
          element={isAuthenticated ? <Index /> : <Navigate to={"/login"} />}
        ></Route>
      </Routes>
    </>
  );
};

export default AppRoutes;
