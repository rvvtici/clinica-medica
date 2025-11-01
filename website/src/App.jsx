import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './components/Auth/AuthContext';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import Login from './components/Login/Login';
import Home from './components/Home/Home';
import Profile from './components/Perfil/Profile';
import Especialidades from './components/Especialidades/Especialidades';
import Convenios from './components/Convenios/Convenios';

import EditarPerfil from './components/Atendente/EditarPerfil';


function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route 
            path="/home" 
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            } 
          />


          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } 
          />


          <Route 
            path="/editar-perfil" 
            element={
              <ProtectedRoute>
                <EditarPerfil />
              </ProtectedRoute>
            } 
          />

          <Route path="/especialidades" element={<Especialidades />} />
          <Route path="/convenios" element={<Convenios />} />
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;