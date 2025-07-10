import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import KanbanPage from "./components/KanbanPage";
import PrivateRoute from "./components/PrivateRoute";
function App() {
  // const isLoggedIn = !!localStorage.getItem("token"); // simple auth check

  return (
    <Routes>
      <Route path="/" element={<Navigate to={ "/login"} />} /> 
      <Route path="/login" element={<Login />} /> 
      
       
      
       
      {/* <Route path="/dashboard" element={<KanbanPage />} />  */}
     
      <Route path="/register" element={<Register />} /> 
       <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <KanbanPage />
          </PrivateRoute>
        }
       />
    </Routes>
    
  );
}

export default App;
